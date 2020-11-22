## 课程说明

- 圈子功能说明
- 圈子技术实现
- 圈子技术方案
- 圈子实现发布动态
- 圈子实现好友动态
- 圈子实现推荐动态
- 圈子实现点赞、喜欢功能（放到后面实现）
- 圈子实现评论（放到后面实现）
- 圈子实现评论的点赞（放到后面实现）

## 1. 圈子功能

### 1.1 功能说明

探花交友项目中的圈子功能，类似微信的朋友圈，基本的功能为：发布动态、浏览好友动态、浏览推荐动态、点赞、评论、喜欢等功能。

 ![1567496518185](assets/1567496518185.png)

发布：

 ![1567497614205](assets/1567497614205.png)

### 1.2 实现方案分析

对于圈子功能的实现，我们需要对它的功能特点做分析：

- 数据量会随着用户数增大而增大
- 读多写少
- 非好友看不到其动态内容
- ……

针对以上特点，我们来分析一下：

- 对于数据量大而言，显然不能够使用关系型数据库进行存储，我们需要通过MongoDB进行存储
- 对于读多写少的应用，需要减少读取的成本
  - 比如说，一条SQL语句，单张表查询一定比多张表查询要快
- 对于每个人数据在存储层面最好做到相互隔离，这样的话就不会有影响

**所以对于存储而言，主要是核心的4张表：**

- 发布表：记录了所有用户的发布的东西信息，如图片、视频等。
- 相册：相册是每个用户独立的，记录了该用户所发布的所有内容。
- 评论：针对某个具体发布的朋友评论和点赞操作。
- 时间线：所谓“刷朋友圈”，就是刷时间线，就是一个用户所有的朋友的发布内容。

### 1.3 技术方案

根据之前我们的分析，对于技术方案而言，将采用MongoDB+Redis来实现，其中MongoDB负责存储，Redis负责缓存数据。

#### 1.3.1 发布流程

 ![1567523191578](assets/1567523191578.png)

流程说明：

- 用户发布动态，首先将动态内容写入到发布表。
- 然后，将发布的指向写入到自己的相册表中。
- 最后，将发布的指向写入到好友的时间线中。

#### 1.3.2 查看流程

 ![1567525088273](assets/1567525088273.png)

流程说明：

- 用户查看动态，如果查看自己的动态，直接查询相册表即可
- 如果查看好友动态，查询时间线表即可
- 如果查看推荐动态，查看推荐表即可

由此可见，查看动态的成本较低，可以快速的查询到动态数据。

### 1.4 表结构设计

> **发布表：**

~~~json
#表名：quanzi_publish
{
    "id":1,#主键id
    "userId":1, #用户id
    "text":"今天心情很好", #文本内容
    "medias":"http://xxxx/x/y/z.jpg", #媒体数据，图片或小视频 url
    "seeType":1, #谁可以看，1-公开，2-私密，3-部分可见，4-不给谁看
    "seeList":[1,2,3], #部分可见的列表
    "notSeeList":[4,5,6],#不给谁看的列表
	"longitude":108.840974298098,#经度
	"latitude":34.2789316522934,#纬度
    "locationName":"上海市浦东区", #位置名称
    "created",1568012791171 #发布时间
}
~~~

> **相册表：**

~~~json
#表名：quanzi_album_{userId}
{
    "id":1,#主键id
    "publishId":1001, #发布id
    "created":1568012791171 #发布时间
}
~~~

> **时间线表：**

~~~json
#表名：quanzi_time_line_{userId}
{
    "id":1,#主键id,
    "userId":2, #好友id
    "publishId":1001, #发布id
    "date":1568012791171 #发布时间
}
~~~

> **评论表：**

~~~json
#表名：quanzi_comment
{
    "id":1, #主键id
    "publishId":1001, #发布id
    "commentType":1, #评论类型，1-点赞，2-评论，3-喜欢
    "content":"给力！", #评论内容
    "userId":2, #评论人
    "isParent":false, #是否为父节点，默认是否
    "parentId":1001, #父节点id
    "created":1568012791171
}
~~~

### 1.5 关于海量数据的探讨

通过以上表结构的设计，可以满足我们现在的需求，但是，我们需要思考一个问题，如果我们真的拥有了海量数据，会给我们带来什么挑战？

在上述的表设计中，其实是2种设计思路，一种是合表存储，另外一种是分表存储。无论是分表还是合表存储，在面临海量数据时都会有很大的压力，那么我们该怎么面对呢？

MongoDB出现就是在解决海量数据存储问题的，那么MongoDB是如何解决的呢？  答案是：**集群**。

MongoDB有三种集群方式，分别是：主从集群、副本集群、分片式集群，其中主从集群官方已经不推荐了，一般用副本集群取代主从集群。

#### 1.5.1 副本集群

一个主，两个从库组成，主库宕机时，这两个从库都可以被选为主库。

 ![img](assets/1190037-20180106145148128-1854811460.png)

当主库宕机后,两个从库都会进行竞选，其中一个变为主库，当原主库恢复后，作为从库加入当前的复制集群即可。

 ![img](assets/1190037-20180106145154284-397901575.png)

#### 1.5.2 分片集群

分片（sharding）是MongoDB用来将大型集合分割到不同服务器（或者说一个集群）上所采用的方法。

例如，如果数据库1tb的数据集，并有4个分片，然后每个分片可能仅持有256 GB的数据。如果有40个分片，那么每个切分可能只有25GB的数据。

 ![img](assets/1190037-20180106150209471-1233466151.png)

MongoDB中数据的分片是以集合为基本单位的，集合中的数据通过片键（Shard key）被分成多部分。其实片键就是在集合中选一个键，用该键的值作为数据拆分的依据。

一般片键采用范围或哈希的方式进行分片。

#### 1.5.3 解决问题

了解完MongoDB的集群方案后，为了实现海量数据存储的需求，我们应该选择分片式集群，下面我们探讨下圈子的表设计。

- 发布表（quanzi_publish）
  - 建议选择userId作为片键。
- 评论表（quanzi_comment）
  - 建议选择publishId作为片键。
- 相册表（quanzi_album_{userId}）
  - 由于MongoDB的分片是集群集合的，所以需要将相册表的数据写入到一个集合中，按照userId进行分片。（增加userId字段）
- 时间线表（quanzi_time_line_{userId}）
  - 与相册相同，需要将数据写入到一个集合，按照my_userId进行分片。（增加my_userId字段）

## 2. 圈子实现 

> 升级Genymotion：
>
> Genymotion版本：3.0.2
>
> 镜像版本：
>
>     ![1567688597143](assets/1567688597143.png)

### 2.1 pojo

写到dubbo工程中：

~~~java
package com.tanhua.dubbo.server.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * 发布表，动态内容
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quanzi_publish")
public class Publish implements java.io.Serializable {

    private static final long serialVersionUID = 8732308321082804771L;

    private ObjectId id; //主键id
    private Long userId;
    private String text; //文字
    private List<String> medias; //媒体数据，图片或小视频 url
    private Integer seeType; // 谁可以看，1-公开，2-私密，3-部分可见，4-不给谁看
    private List<Long> seeList; //部分可见的列表
    private List<Long> notSeeList; //不给谁看的列表
    private String longitude; //经度
    private String latitude; //纬度
    private String locationName; //位置名称
    private Long created; //发布时间

}
~~~

~~~java
package com.tanhua.dubbo.server.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 相册表，用于存储自己发布的数据，每一个用户一张表进行存储
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quanzi_album")
public class Album implements java.io.Serializable {

    private static final long serialVersionUID = 432183095092216817L;

    private ObjectId id; //主键id

    private ObjectId publishId; //发布id
    private Long created; //发布时间

}

~~~

~~~java
package com.tanhua.dubbo.server.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 时间线表，用于存储发布（或推荐）的数据，每一个用户一张表进行存储
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quanzi_time_line")
public class TimeLine implements java.io.Serializable{
    private static final long serialVersionUID = 9096178416317502524L;
    private ObjectId id;

    private Long userId; // 好友id
    private ObjectId publishId; //发布id

    private Long date; //发布的时间

}

~~~

~~~java
package com.tanhua.dubbo.server.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * 评论表
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "quanzi_comment")
public class Comment implements java.io.Serializable{

    private static final long serialVersionUID = -291788258125767614L;

    private ObjectId id;

    private ObjectId publishId; //发布id
    private Integer commentType; //评论类型，1-点赞，2-评论，3-喜欢
    private String content; //评论内容
    private Long userId; //评论人

    private Boolean isParent = false; //是否为父节点，默认是否
    private ObjectId parentId; // 父节点id

    private Long created; //发表时间

}

~~~

~~~java
package com.tanhua.dubbo.server.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tanhua_users")
public class Users implements java.io.Serializable{

    private static final long serialVersionUID = 6003135946820874230L;
    private ObjectId id;
    private Long userId; //用户id
    private Long friendId; //好友id
    private Long date; //时间
}

~~~

### 2.2 发布动态

#### 2.2.1 定义接口

~~~java
package com.tanhua.dubbo.server.api;

import com.tanhua.dubbo.server.pojo.Publish;

public interface QuanZiApi {

    /**
     * 发布动态
     *
     * @param publish
     * @return
     */
    boolean savePublish(Publish publish);

}

~~~

#### 2.2.2 编写实现

构造好友数据：

~~~java
package com.tanhua.dubbo.server.api;

import com.tanhua.dubbo.server.pojo.Users;
import org.bson.types.ObjectId;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class TestUsers {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Test
    public void saveUsers(){
        this.mongoTemplate.save(new Users(ObjectId.get(),1L, 2L, System.currentTimeMillis()));
        this.mongoTemplate.save(new Users(ObjectId.get(),1L, 3L, System.currentTimeMillis()));
        this.mongoTemplate.save(new Users(ObjectId.get(),1L, 4L, System.currentTimeMillis()));
        this.mongoTemplate.save(new Users(ObjectId.get(),1L, 5L, System.currentTimeMillis()));
        this.mongoTemplate.save(new Users(ObjectId.get(),1L, 6L, System.currentTimeMillis()));
    }

    @Test
    public void testQueryList(){
        Criteria criteria = Criteria.where("userId").is(1L);
        List<Users> users = this.mongoTemplate.find(Query.query(criteria), Users.class);
        for (Users user : users) {
            System.out.println(user);
        }
    }
}
                       
~~~

实现发布：

~~~java
package com.tanhua.dubbo.server.api;

import com.alibaba.dubbo.config.annotation.Service;
import com.tanhua.dubbo.server.pojo.Album;
import com.tanhua.dubbo.server.pojo.Publish;
import com.tanhua.dubbo.server.pojo.TimeLine;
import com.tanhua.dubbo.server.pojo.Users;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.Date;
import java.util.List;

@Service(version = "1.0.0")
public class QuanZiApiImpl implements QuanZiApi {

    @Autowired
    private MongoTemplate mongoTemplate;


    @Override
    public boolean savePublish(Publish publish) {

        // 校验
        if (publish.getUserId() == null) {
            return false;
        }

        try {
            publish.setCreated(System.currentTimeMillis()); //设置创建时间
            publish.setId(ObjectId.get()); //设置id
            this.mongoTemplate.save(publish); //保存发布

            Album album = new Album(); // 构建相册对象
            album.setPublishId(publish.getId());
            album.setCreated(System.currentTimeMillis());
            album.setId(ObjectId.get());
            this.mongoTemplate.save(album, "quanzi_album_" + publish.getUserId());

            //写入好友的时间线中
            Criteria criteria = Criteria.where("userId").is(publish.getUserId());
            List<Users> users = this.mongoTemplate.find(Query.query(criteria), Users.class);
            for (Users user : users) {
                TimeLine timeLine = new TimeLine();
                timeLine.setId(ObjectId.get());
                timeLine.setPublishId(publish.getId());
                timeLine.setUserId(user.getUserId());
                timeLine.setDate(System.currentTimeMillis());
                this.mongoTemplate.save(timeLine, "quanzi_time_line_" + user.getFriendId());
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            //TODO 出错的事务回滚，MongoDB非集群不支持事务，暂不进行实现
        }

        return false;
    }
}

~~~

测试用例：

~~~java
@Test
public void testSavePublish(){
    Publish publish = new Publish();
    publish.setUserId(1L);
    publish.setLocationName("上海市");
    publish.setSeeType(1);
    publish.setText("今天天气不错~");
    publish.setMedias(Arrays.asList("https://itcast-tanhua.oss-cn-shanghai.aliyuncs.com/images/quanzi/1.jpg"));
    boolean result = this.quanZiApi.savePublish(publish);
    System.out.println(result);
}
~~~

#### 2.2.3 编写接口服务

在服务工程中编写接口服务。

##### 2.2.3.1 Controller

~~~java
package com.tanhua.server.controller;

import com.tanhua.server.service.MovementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("movements")
public class MovementsController {

    @Autowired
    private MovementsService movementsService;

    /**
     * 发送动态
     * 
     * @param textContent
     * @param location
     * @param multipartFile
     * @param token
     * @return
     */
    @PostMapping()
    public ResponseEntity<Void> savePublish(@RequestParam(value = "textContent", required = false) String textContent,
                                            @RequestParam(value = "location", required = false) String location,
                                            @RequestParam(value = "latitude", required = false) String latitude,
                                            @RequestParam(value = "longitude", required = false) String longitude,
                                            @RequestParam(value = "imageContent", required = false) MultipartFile[] multipartFile,
                                            @RequestHeader("Authorization") String token) {
        try {
            boolean result = this.movementsService.savePublish(textContent, location,latitude, longitude, multipartFile, token);
            if(result){
                return ResponseEntity.ok(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

}
~~~

##### 2.2.3.2 MovementsService

~~~java
package com.tanhua.server.service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.tanhua.common.pojo.User;
import com.tanhua.server.service.PicUploadService;
import com.tanhua.common.vo.PicUploadResult;
import com.tanhua.dubbo.server.api.QuanZiApi;
import com.tanhua.dubbo.server.pojo.Publish;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovementsService {

    @Reference(version = "1.0.0")
    private QuanZiApi quanZiApi;

    @Autowired
    private PicUploadService picUploadService;

    @Autowired
    private UserService userService;

    public boolean savePublish(String textContent,
                               String location,
                               String latitude,
                               String longitude,
                               MultipartFile[] multipartFile,
                               String token) {

        //查询当前的登录信息
        User user = this.userService.queryUserByToken(token);
        if (null == user) {
            return false;
        }

        Publish publish = new Publish();
        publish.setUserId(user.getId());
        publish.setText(textContent);
        publish.setLocationName(location);
        publish.setLatitude(latitude);
        publish.setLongitude(longitude);
        publish.setSeeType(1);

        List<String> picUrls = new ArrayList<>();
        //图片上传
        for (MultipartFile file : multipartFile) {
            PicUploadResult picUploadResult = this.picUploadService.upload(file);
            picUrls.add(picUploadResult.getName());
        }

        publish.setMedias(picUrls);
        return this.quanZiApi.savePublish(publish);
    }
}

~~~

##### 2.2.3.3 PicUploadService

导入所需依赖：

~~~xml
 <dependency>
     <groupId>com.aliyun.oss</groupId>
     <artifactId>aliyun-sdk-oss</artifactId>
     <version>2.8.3</version>
</dependency>
<dependency>
    <groupId>joda-time</groupId>
    <artifactId>joda-time</artifactId>
</dependency>
~~~

~~~java
package com.tanhua.server.service;

import com.aliyun.oss.OSSClient;
import com.tanhua.server.config.AliyunConfig;
import com.tanhua.server.vo.PicUploadResult;
import org.apache.commons.lang3.RandomUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

@Service
public class PicUploadService {

    // 允许上传的格式
    private static final String[] IMAGE_TYPE = new String[]{".bmp", ".jpg",
            ".jpeg", ".gif", ".png"};

    @Autowired
    private OSSClient ossClient;

    @Autowired
    private AliyunConfig aliyunConfig;

    public PicUploadResult upload(MultipartFile uploadFile) {

        PicUploadResult fileUploadResult = new PicUploadResult();

        //图片做校验，对后缀名
        boolean isLegal = false;

        for (String type : IMAGE_TYPE) {
            if (StringUtils.endsWithIgnoreCase(uploadFile.getOriginalFilename(),
                    type)) {
                isLegal = true;
                break;
            }
        }

        if (!isLegal) {
            fileUploadResult.setStatus("error");
            return fileUploadResult;
        }

        // 文件新路径
        String fileName = uploadFile.getOriginalFilename();
        String filePath = getFilePath(fileName);

        // 上传到阿里云
        try {
            // 目录结构：images/2018/12/29/xxxx.jpg
            ossClient.putObject(aliyunConfig.getBucketName(), filePath, new
                    ByteArrayInputStream(uploadFile.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
            //上传失败
            fileUploadResult.setStatus("error");
            return fileUploadResult;
        }

        // 上传成功
        fileUploadResult.setStatus("done");
        fileUploadResult.setName(this.aliyunConfig.getUrlPrefix() + filePath);
        fileUploadResult.setUid(String.valueOf(System.currentTimeMillis()));

        return fileUploadResult;
    }

    private String getFilePath(String sourceFileName) {
        DateTime dateTime = new DateTime();
        return "images/" + dateTime.toString("yyyy")
                + "/" + dateTime.toString("MM") + "/"
                + dateTime.toString("dd") + "/" + System.currentTimeMillis() +
                RandomUtils.nextInt(100, 9999) + "." +
                StringUtils.substringAfterLast(sourceFileName, ".");
    }

}

~~~

##### 2.2.3.4 AliyunConfig

~~~java
package com.tanhua.server.config;

import com.aliyun.oss.OSSClient;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:aliyun.properties")
@ConfigurationProperties(prefix = "aliyun")
@Data
public class AliyunConfig {

    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;
    private String urlPrefix;

    @Bean
    public OSSClient oSSClient() {
        return new OSSClient(endpoint, accessKeyId, accessKeySecret);
    }

}
~~~

##### 2.2.3.5 aliyun.properties

~~~properties
aliyun.endpoint = http://oss-cn-shanghai.aliyuncs.com
aliyun.accessKeyId = xxxxx
aliyun.accessKeySecret = xxxx
aliyun.bucketName=itcast-tanhua
aliyun.urlPrefix=http://itcast-tanhua.oss-cn-shanghai.aliyuncs.com/
~~~

##### 2.2.3.5 PicUploadResult

~~~java
package com.tanhua.server.vo;

import lombok.Data;

@Data
public class PicUploadResult {

    // 文件唯一标识
    private String uid;
    // 文件名
    private String name;
    // 状态有：uploading done error removed
    private String status;
    // 服务端响应内容，如：'{"status": "success"}'
    private String response;

}
~~~

#### 2.2.4 测试

![1567687781487](assets/1567687781487.png)

 ![1567687794406](assets/1567687794406.png)

 结果：![1567687806725](assets/1567687806725.png)

#### 2.2.5 整合测试

 ![1567688253472](assets/1567688253472.png)

 ![1567688271394](assets/1567688271394.png)

### 2.3 统一处理token

在之前的开发中，我们会在每一个Service中对token做处理，相同的逻辑一定是要进行统一处理的，接下来我们将使用拦截器+ThreadLocal的方式进行解决。

#### 2.3.1 编写UserThreadLocal

~~~java
package com.tanhua.server.utils;

import com.tanhua.server.pojo.User;

public class UserThreadLocal {

    private static final ThreadLocal<User> LOCAL = new ThreadLocal<User>();

    private UserThreadLocal() {

    }

    public static void set(User user) {
        LOCAL.set(user);
    }

    public static User get() {
        return LOCAL.get();
    }

}

~~~

#### 2.3.2 编写TokenInterceptor

~~~java
package com.tanhua.server.interceptor;

import com.tanhua.server.pojo.User;
import com.tanhua.server.service.UserService;
import com.tanhua.server.utils.NoAuthorization;
import com.tanhua.server.utils.UserThreadLocal;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 统一完成根据token查询用User的功能
 */
@Component
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            NoAuthorization noAnnotation = handlerMethod.getMethod().getAnnotation(NoAuthorization.class);
            if (noAnnotation != null) {
                // 如果该方法被标记为无需验证token，直接返回即可
                return true;
            }
        }

        String token = request.getHeader("Authorization");
        if (StringUtils.isNotEmpty(token)) {
            User user = this.userService.queryUserByToken(token);
            if (null != user) {
                UserThreadLocal.set(user); //将当前对象，存储到当前的线程中
                return true;
            }
        }

        //请求头中如不存在Authorization直接返回false
        response.setStatus(401); //无权限访问
        return false;
    }
}

~~~

#### 2.3.3 编写注解NoAuthorization

~~~java
package com.tanhua.server.utils;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented //标记注解
public @interface NoAuthorization {

}
~~~

#### 2.3.4 注册拦截器

~~~java
package com.tanhua.server.config;

import com.tanhua.server.interceptor.RedisCacheInterceptor;
import com.tanhua.server.interceptor.TokenInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private RedisCacheInterceptor redisCacheInterceptor;
    @Autowired
    private TokenInterceptor tokenInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注意拦截器的顺序
        registry.addInterceptor(this.tokenInterceptor).addPathPatterns("/**");
        registry.addInterceptor(this.redisCacheInterceptor).addPathPatterns("/**");
    }
}
~~~

#### 2.3.5 使用ThreadLocal

 ![1567741529854](assets/1567741529854.png)

### 2.4 查询好友动态

查询好友动态其实就是查询自己的时间线表，好友在发动态时已经将动态信息写入到了自己的时间线表中。

#### 2.4.1 编写dubbo接口

~~~java
package com.tanhua.dubbo.server.api;

import com.tanhua.dubbo.server.pojo.Publish;
import com.tanhua.dubbo.server.vo.PageInfo;

public interface QuanZiApi {

    /**
     * 发布动态
     *
     * @param publish
     * @return
     */
    boolean savePublish(Publish publish);

    /**
     * 查询动态
     *
     * @return
     */
    PageInfo<Publish> queryPublishList(Long userId, Integer page, Integer pageSize);

}

~~~

#### 2.4.2 编写实现

~~~java
    @Override
    public PageInfo<Publish> queryPublishList(Long userId, Integer page, Integer pageSize) {
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize, Sort.by(Sort.Order.desc("created")));
        Query query = new Query().with(pageRequest);

        //查询时间线表
        List<TimeLine> timeLineList = this.mongoTemplate.find(query, TimeLine.class, "quanzi_time_line_" + userId);

        List<ObjectId> publishIds = new ArrayList<>();
        for (TimeLine timeLine : timeLineList) {
            publishIds.add(timeLine.getPublishId());
        }

        //查询发布信息
        Query queryPublish = Query.query(Criteria.where("id").in(publishIds)).with(Sort.by(Sort.Order.desc("created")));
        List<Publish> publishList = this.mongoTemplate.find(queryPublish, Publish.class);
        PageInfo<Publish> pageInfo = new PageInfo<>();
        pageInfo.setPageNum(page);
        pageInfo.setPageSize(pageSize);
        pageInfo.setRecords(publishList);
        pageInfo.setTotal(0); //不提供总数
        return pageInfo;
    }
~~~

#### 2.4.3 编写接口服务

在itcast-tanhua-server中完成。

~~~java
/**
 * 查询好友动态
 *
 * @param page
 * @param pageSize
 * @return
 */
@GetMapping
public PageResult queryPublishList(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                   @RequestParam(value = "pagesize", defaultValue = "10") Integer pageSize) {
    return this.movementsService.queryPublishList(page, pageSize);
}
~~~

#### 2.4.4 编写movementsService

TODO的内容，在后面实现。

~~~java
/**
 * 查询好友动态
 *
 * @param page
 * @param pageSize
 * @return
 */
public PageResult queryPublishList(Integer page, Integer pageSize) {
    PageResult pageResult = new PageResult();
    //获取当前的登录信息
    User user = UserThreadLocal.get();

    PageInfo<Publish> pageInfo = this.quanZiApi.queryPublishList(user.getId(), page, pageSize);
    pageResult.setPagesize(pageSize);
    pageResult.setPage(page);
    pageResult.setCounts(0);
    pageResult.setPages(0);

    List<Publish> records = pageInfo.getRecords();

    if (CollectionUtils.isEmpty(records)) {
        //没有动态信息
        return pageResult;
    }

    List<Movements> movementsList = new ArrayList<>();
    for (Publish record : records) {
        Movements movements = new Movements();

        movements.setId(record.getId().toHexString());
        movements.setImageContent(record.getMedias().toArray(new String[]{}));
        movements.setTextContent(record.getText());
        movements.setUserId(record.getUserId());
        movements.setCreateDate(RelativeDateFormat.format(new Date(record.getCreated())));

        movementsList.add(movements);
    }

    List<Long> userIds = new ArrayList<>();
    for (Movements movements : movementsList) {
        if(!userIds.contains(movements.getId())){
            userIds.add(movements.getUserId());
        }

    }

    QueryWrapper<UserInfo> queryWrapper = new QueryWrapper<>();
    queryWrapper.in("user_id", userIds);
    List<UserInfo> userInfos = this.userInfoService.queryList(queryWrapper);
    for (Movements movements : movementsList) {
        for (UserInfo userInfo : userInfos) {
            if (movements.getUserId().longValue() == userInfo.getUserId().longValue()) {
                movements.setAge(userInfo.getAge());
                movements.setAvatar(userInfo.getLogo());
                movements.setGender(userInfo.getSex().name().toLowerCase());
                movements.setNickname(userInfo.getNickName());
                movements.setTags(StringUtils.split(userInfo.getTags(), ','));
                movements.setCommentCount(10); //TODO 评论数
                movements.setDistance("1.2公里"); //TODO 距离
                movements.setHasLiked(1); //TODO 是否点赞（1是，0否）
                movements.setHasLoved(0); //TODO 是否喜欢（1是，0否）
                movements.setLikeCount(100); //TODO 点赞数
                movements.setLoveCount(80); //TODO 喜欢数
                break;
            }
        }
    }

    pageResult.setItems(movementsList);
    return pageResult;
}
~~~

~~~java
package com.tanhua.server.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
 
public class RelativeDateFormat {
 
    private static final long ONE_MINUTE = 60000L;
    private static final long ONE_HOUR = 3600000L;
    private static final long ONE_DAY = 86400000L;
    private static final long ONE_WEEK = 604800000L;
 
    private static final String ONE_SECOND_AGO = "秒前";
    private static final String ONE_MINUTE_AGO = "分钟前";
    private static final String ONE_HOUR_AGO = "小时前";
    private static final String ONE_DAY_AGO = "天前";
    private static final String ONE_MONTH_AGO = "月前";
    private static final String ONE_YEAR_AGO = "年前";
 
    public static void main(String[] args) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:m:s");
        Date date = format.parse("2013-11-11 18:35:35");
        System.out.println(format(date));
    }
 
    public static String format(Date date) {
        long delta = new Date().getTime() - date.getTime();
        if (delta < 1L * ONE_MINUTE) {
            long seconds = toSeconds(delta);
            return (seconds <= 0 ? 1 : seconds) + ONE_SECOND_AGO;
        }
        if (delta < 45L * ONE_MINUTE) {
            long minutes = toMinutes(delta);
            return (minutes <= 0 ? 1 : minutes) + ONE_MINUTE_AGO;
        }
        if (delta < 24L * ONE_HOUR) {
            long hours = toHours(delta);
            return (hours <= 0 ? 1 : hours) + ONE_HOUR_AGO;
        }
        if (delta < 48L * ONE_HOUR) {
            return "昨天";
        }
        if (delta < 30L * ONE_DAY) {
            long days = toDays(delta);
            return (days <= 0 ? 1 : days) + ONE_DAY_AGO;
        }
        if (delta < 12L * 4L * ONE_WEEK) {
            long months = toMonths(delta);
            return (months <= 0 ? 1 : months) + ONE_MONTH_AGO;
        } else {
            long years = toYears(delta);
            return (years <= 0 ? 1 : years) + ONE_YEAR_AGO;
        }
    }
 
    private static long toSeconds(long date) {
        return date / 1000L;
    }
 
    private static long toMinutes(long date) {
        return toSeconds(date) / 60L;
    }
 
    private static long toHours(long date) {
        return toMinutes(date) / 60L;
    }
 
    private static long toDays(long date) {
        return toHours(date) / 24L;
    }
 
    private static long toMonths(long date) {
        return toDays(date) / 30L;
    }
 
    private static long toYears(long date) {
        return toMonths(date) / 365L;
    }
 
}

~~~



Movements对象：

~~~java
package com.tanhua.server.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movements {

    private String id; //动态id
    private Long userId; //用户id
    private String avatar; //头像
    private String nickname; //昵称
    private String gender; //性别 man woman
    private Integer age; //年龄
    private String[] tags; //标签
    private String textContent; //文字动态
    private String[] imageContent; //图片动态
    private String distance; //距离
    private String createDate; //发布时间 如: 10分钟前
    private Integer likeCount; //点赞数
    private Integer commentCount; //评论数
    private Integer loveCount; //喜欢数
    private Integer hasLiked; //是否点赞（1是，0否）
    private Integer hasLoved; //是否喜欢（1是，0否）

}

~~~

#### 2.4.5 测试

 ![1567911403118](assets/1567911403118.png)

### 2.5 查询推荐动态

推荐动态是通过推荐系统计算出的结果，现在我们只需要实现查询即可，推荐系统在后面的课程中完成。

推荐动态和好友动态的结构是一样的，所以我们只需要查询推荐的时间表即可。

#### 2.5.1 修改dubbo服务逻辑 

![1567948462058](assets/1567948462058.png)

#### 2.5.2 编写测试用例

该测试用例用于插入推荐数据。

~~~java
@Test
public void testRecommendPublish(){
    //查询用户id为2的动态作为推荐动态的数据
    PageInfo<Publish> pageInfo = this.quanZiApi.queryPublishList(2L, 1, 10);
    for (Publish record : pageInfo.getRecords()) {

        TimeLine timeLine = new TimeLine();
        timeLine.setId(ObjectId.get());
        timeLine.setPublishId(record.getId());
        timeLine.setUserId(record.getUserId());
        timeLine.setDate(System.currentTimeMillis());

        this.mongoTemplate.save(timeLine, "quanzi_time_line_recommend");
    }
}
~~~

#### 2.5.3 MovementsController

~~~java
/**
 * 查询推荐动态
 *
 * @param page
 * @param pageSize
 * @return
 */
@GetMapping("recommend")
public PageResult queryRecommendPublishList(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                   @RequestParam(value = "pagesize", defaultValue = "10") Integer pageSize) {
    return this.movementsService.queryPublishList(page, pageSize, true);
}
~~~

#### 2.5.4 MovementsService

![1567948993461](assets/1567948993461.png)

#### 2.5.5 整合测试

 ![1567949159836](assets/1567949159836.png)
