## 课程说明

- 后台系统简介
- 搭建前端系统
- 实现登录功能
- 实现首页功能

## 1. 后台系统简介

探花交友APP建立的后台管理系统，目的是完成探花交友项目的业务闭环，主要功能包括：用户管理、动态管理、审核管理已经系统管理。

产品原型：https://app.mockplus.cn/run/prototype/ptk3SbC85vNw/ycNeP0f3g/DhjMMspkJ

### 1.1 功能说明

 ![image-20200921180145987](assets/image-20200921180145987.png)

课程中实现的功能有：登录、首页、用户管理、动态审核。

### 1.2 流程说明

动态审核：

![image-20200921180731594](assets/image-20200921180731594.png)

## 2. 搭建前端系统

后台系统也是采用前后端分离的方式，前端采用Vue.js实现，关于前端系统我们不进行实现，拿来直接使用。

演示地址：https://tanhua-admin.itheima.net/

![image-20200921182328856](assets/image-20200921182328856.png)

### 2.1 安装Node.JS

vue需要有Node.js的支持，需要先安装node.js环境。

官网：https://nodejs.org/en/

下载LTS版本：

 ![image-20200921202135210](assets/image-20200921202135210.png)

下载得到node-v12.18.4-x64.msi，一路下一步进行安装。

查看nodejs的版本：

 ![image-20200921202315752](assets/image-20200921202315752.png)

### 2.2 部署前端项目

将project-tanhua-admin-vue-ts.zip解压出来，导入到Idea中进行启动。

 ![image-20200921203623889](assets/image-20200921203623889.png)

~~~shell
#安装依赖
yarn install

yarn install v1.12.1
[1/4] Resolving packages...
[2/4] Fetching packages...
info fsevents@2.1.3: The platform "win32" is incompatible with this module.
info "fsevents@2.1.3" is an optional dependency and failed compatibility check. Excluding it from installation.
info fsevents@1.2.13: The platform "win32" is incompatible with this module.
info "fsevents@1.2.13" is an optional dependency and failed compatibility check. Excluding it from installation.
[3/4] Linking dependencies...
warning "@vue/eslint-config-typescript > @typescript-eslint/eslint-plugin@1.13.0" has incorrect peer dependency "eslint@^5.0.0".
warning "@vue/eslint-config-typescript > @typescript-eslint/parser@1.13.0" has incorrect peer dependency "eslint@^5.0.0".
warning " > babel-core@7.0.0-bridge.0" has unmet peer dependency "@babel/core@^7.0.0-0".
warning " > eslint-plugin-vue@5.2.3" has incorrect peer dependency "eslint@^5.0.0".
warning "eslint-plugin-vue > vue-eslint-parser@5.0.0" has incorrect peer dependency "eslint@^5.0.0".
[4/4] Building fresh packages...
Done in 59.66s.

#启动服务
yarn serve

No type errors found
Version: typescript 3.6.2
Time: 12428ms

  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.31.98:8080/

  Note that the development build is not optimized.
  To create a production build, run yarn build.
~~~

在.env文件中修改api接口地址：

~~~shell
VUE_APP_BASE_API = 'http://127.0.0.1/management'
~~~

Nginx的配置：

~~~shell
location /management/ {
    client_max_body_size  300m;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    proxy_pass   http://127.0.0.1:18085/;
}
~~~

## 3 登录

后台系统的登录模块独立于APP端的登录。

表结构：

~~~sql
CREATE TABLE `tb_admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(255) NOT NULL COMMENT '账号',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `created` datetime NOT NULL COMMENT '创建时间',
  `updated` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='后台管理员表';

INSERT INTO `tb_admin` (`id`, `username`, `password`, `avatar`, `created`, `updated`) VALUES ('1', 'admin', 'e10adc3949ba59abbe56e057f20f883e', NULL, '2020-09-07 17:55:28', '2020-09-07 17:55:28');
~~~

### 3.1 创建my-tanhua-manage

pom.xml：

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>my-tanhua</artifactId>
        <groupId>cn.itcast.tanhua</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>my-tanhua-manage</artifactId>

    <dependencies>
        <dependency>
            <groupId>cn.itcast.tanhua</groupId>
            <artifactId>my-tanhua-dubbo-interface</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!--dubbo的springboot支持-->
        <dependency>
            <groupId>com.alibaba.boot</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
            <version>0.2.0</version>
        </dependency>
        <!--dubbo框架-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>dubbo</artifactId>
            <version>2.6.4</version>
        </dependency>
        <!--zk依赖-->
        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.4.13</version>
        </dependency>
        <dependency>
            <groupId>com.github.sgroschupf</groupId>
            <artifactId>zkclient</artifactId>
            <version>0.1</version>
        </dependency>
        <!--其他工具包依赖-->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
        </dependency>
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis.mybatis-plus}</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>commons-codec</groupId>
            <artifactId>commons-codec</artifactId>
        </dependency>
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.6</version>
        </dependency>
        <!--RocketMQ相关-->
        <dependency>
            <groupId>org.apache.rocketmq</groupId>
            <artifactId>rocketmq-spring-boot-starter</artifactId>
            <version>2.0.3</version>
        </dependency>
        <dependency>
            <groupId>org.apache.rocketmq</groupId>
            <artifactId>rocketmq-client</artifactId>
            <version>4.6.0</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.1</version>
        </dependency>
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.4.3</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
~~~

application.properties：

~~~properties
spring.profiles.active=local
~~~

application-local.properties：

~~~properties
spring.application.name = itcast-tanhua-manager
server.port = 18085

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/mytanhua?useUnicode=true&characterEncoding=utf8&autoReconnect=true&allowMultiQueries=true&useSSL=false&serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=root

mybatis-plus.type-enums-package=com.tanhua.manage.enums
mybatis-plus.global-config.db-config.table-prefix=tb_
mybatis-plus.global-config.db-config.id-type=auto
mybatis-plus.mapper-locations=classpath:mapper/*.xml

dubbo.application.name = itcast-tanhua-manage
dubbo.registry.address = zookeeper://192.168.31.81:2181
dubbo.registry.client = zkclient
dubbo.consumer.timeout=5000

spring.redis.jedis.pool.max-wait = 5000ms
spring.redis.jedis.pool.max-Idle = 100
spring.redis.jedis.pool.min-Idle = 10
spring.redis.timeout = 10s
#spring.redis.host= 172.17.0.73
#spring.redis.port= 6379
spring.redis.cluster.nodes = 192.168.31.81:6379,192.168.31.81:6380,192.168.31.81:6381
spring.redis.cluster.max-redirects=5

# RocketMQ
spring.rocketmq.nameServer=192.168.31.81:9876
spring.rocketmq.producer.group=tanhua

#itcast_tanhua
jwt.secret=76bd425b6f29f7fcc2e0bfc286043df1

~~~

### 3.2 验证码

#### 3.2.1 接口

 ![image-20200922110555409](assets/image-20200922110555409.png)

#### 3.2.2 AdminController

~~~java
package com.tanhua.manage.controller;

import cn.hutool.captcha.CaptchaUtil;
import cn.hutool.captcha.LineCaptcha;
import com.tanhua.manage.service.AdminService;
import com.tanhua.manage.util.NoAuthorization;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/system/users")
@Slf4j
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * 获取验证码图片
     *
     * @param uuid     获取标识
     * @param response
     * @throws Exception
     */
    @GetMapping("/verification")
    @NoAuthorization
    public void verification(@RequestParam(name = "uuid") String uuid, HttpServletResponse response) throws Exception {
        response.setDateHeader("Expires", 0);
        // Set standard HTTP/1.1 no-cache headers.
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        // Set IE extended HTTP/1.1 no-cache headers (use addHeader).
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        // Set standard HTTP/1.0 no-cache header.
        response.setHeader("Pragma", "no-cache");
        response.setContentType("image/jpeg");
        // 实例化验证码工具

        LineCaptcha lineCaptcha = CaptchaUtil.createLineCaptcha(299, 97);
        String captcha = lineCaptcha.getCode();

        adminService.saveCap(uuid, captcha);

        log.info("申请了一个验证码：" + uuid + "  " + captcha);

        lineCaptcha.write(response.getOutputStream());

    }

}

~~~

```java
package com.tanhua.manage.util;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented //标记注解
public @interface NoAuthorization {

}
```

#### 3.2.3 AdminService

```java
package com.tanhua.manage.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
public class AdminService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final String CACHE_KEY_CAP_PREFIX = "MANAGE_CAP_";

    /**
     * 保存验证码信息
     */
    public void saveVerificationCode(String uuid, String code) {

        String key = CACHE_CODE_PREFIX + uuid;
        //将验证码保存到redis中，有效时间为5分钟
        this.redisTemplate.opsForValue().set(key, code, Duration.ofMinutes(5));
    }

}
```

#### 3.2.4 启动

~~~java
package com.tanhua.manage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;

@SpringBootApplication(exclude = {MongoAutoConfiguration.class, MongoDataAutoConfiguration.class})
public class ManageApplication {

    public static void main(String[] args) {
        SpringApplication.run(ManageApplication.class, args);
    }

}

~~~

#### 3.2.5 测试

 ![image-20200922151351419](assets/image-20200922151351419.png)

### 3.3 登录

#### 3.3.1 接口

 ![image-20200922152139545](assets/image-20200922152139545.png)

#### 3.3.2 AdminController

~~~java
    /**
     * 管理员登陆
     */
    @PostMapping("/login")
    @NoAuthorization
    public AdminVo login(@RequestBody AdminVo adminVo) {
        String token = adminService.login(BeanUtil.toBean(adminVo, Admin.class), adminVo.getUuid(), adminVo.getVerificationCode());
        if (StrUtil.isEmpty(token)) {
            throw new BusinessException("登录出错");
        }
        AdminVo vo = new AdminVo();
        vo.setToken(token);
        return vo;
    }

~~~

AdminVo：

~~~java
package com.tanhua.manage.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdminVo {
    private Long id;
    private String username;
    private String avatar;
    private String token;
    private String password;
    private String uuid;
    private String verificationCode;
}
~~~

Admin：

~~~java
package com.tanhua.manage.pojo;

import com.baomidou.mybatisplus.annotation.TableField;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends BasePojo{
    /**
     * id
     */
    private Long id;
    /**
     * 用户名
     */
    private String username;
    /**
     * 密码
     */
    private String password;
    /**
     * 头像
     */
    private String avatar;
    /**
     * token
     */
    @TableField(exist = false)
    private String token;
}

~~~

```java
package com.tanhua.manage.pojo;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.util.Date;

@Data
public abstract class BasePojo {

    @TableField(fill = FieldFill.INSERT)
    private Date created;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updated;
}
```

BusinessException：

~~~java
package com.tanhua.manage.exception;

public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public BusinessException(String message) {
        super(message);
    }
}

~~~

#### 3.3.3  AdminService

```java
package com.tanhua.manage.service;

import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanhua.manage.exception.BusinessException;
import com.tanhua.manage.mapper.AdminMapper;
import com.tanhua.manage.pojo.Admin;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class AdminService extends ServiceImpl<AdminMapper, Admin> {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Value("${jwt.secret}")
    private String secret;

    private static final String CACHE_KEY_TOKEN_PREFIX="MANAGE_TOKEN_";
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * 登录
     */
    public String login(Admin admin,String uuid,String verificationCode){
        //校验验证码是否正确
        if(StrUtil.isEmpty(uuid)||StrUtil.isEmpty(verificationCode)){
            throw new BusinessException("验证码校验错误");
        }

        String redisCapKey = CACHE_KEY_CAP_PREFIX + uuid;
        String code=this.redisTemplate.opsForValue().get(redisCapKey);
        if(StrUtil.isEmpty(code)||!verificationCode.equals(code)){
            throw new BusinessException("验证码校验错误");
        }
        this.redisTemplate.delete(redisCapKey);
		//  select * from tb_admin where username = "admin"
        Admin source=lambdaQuery().eq(Admin::getUsername, admin.getUsername()).one();
        if(source==null){
            throw new BusinessException("用户不存在");
        }

        // 校验密码
        if(StrUtil.isEmpty(admin.getPassword())){
            throw new BusinessException("密码不能为空");
        }
        if(!source.getPassword().equals(SecureUtil.md5(admin.getPassword()))){
            throw new BusinessException("密码错误");
        }

        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("username", source.getUsername());
        claims.put("id", source.getId());

        // 生成token
        String token = Jwts.builder()
                .setClaims(claims) //设置响应数据体
                .signWith(SignatureAlgorithm.HS256, secret) //设置加密方法和加密盐
                .compact();

        try {
            // 将token存储到redis中
            String redisTokenKey = CACHE_KEY_TOKEN_PREIX + token;
            
            //将密码设置为null，不参与序列化
            oneAdmin.setPassword(null);
            
            String redisTokenValue = MAPPER.writeValueAsString(source);
            this.redisTemplate.opsForValue().set(redisTokenKey, redisTokenValue, Duration.ofDays(7));
            return token;
        } catch (Exception e) {
            log.error("存储token出错", e);
            return null;
        }
    }
}
```

AdminMapper：

~~~java
package com.tanhua.manage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tanhua.manage.pojo.Admin;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminMapper extends BaseMapper<Admin> {
}

~~~

#### 3.3.4 测试

 ![image-20200922160834372](assets/image-20200922160834372.png)

测试参数：

~~~json
#url：http://127.0.0.1:18085/system/users/login

{
  "username": "admin",
  "password": "123456",
  "verificationCode": "utia8",
  "uuid": "5512831f-8b60-4962-a2f1-e45531c38d42"
}
~~~

### 3.4 用户基本信息

#### 3.4.1 接口

 ![image-20200922162833847](assets/image-20200922162833847.png)

#### 3.4.2 AdminController

~~~java
    /**
     * 获取个人信息
     */
    @PostMapping("profile")
    public AdminVo profile() {
        Admin admin = UserThreadLocal.get();
        Admin result = adminService.getById(admin.getId());
        if (result == null) {
            throw new BusinessException("无效的凭据");
        }
        result.setPassword(null);
        return BeanUtil.toBean(result, AdminVo.class);
    }
~~~

#### 3.4.3 TokenInterceptor

```java
package com.tanhua.manage.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.tanhua.manage.pojo.Admin;
import com.tanhua.manage.service.AdminService;
import com.tanhua.manage.util.NoAuthorization;
import com.tanhua.manage.util.UserThreadLocal;

@Component
public class TokenInterceptor implements HandlerInterceptor {

    @Autowired
    private AdminService adminService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String method = request.getMethod();
        if (method.equals("OPTIONS")) {
            //跳过跨域中的OPTIONS请求
            return true;
        }
        //判断，请求的方法是否包含了 NoAuthorization ，如果包含了，就不需要做处理
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            NoAuthorization annotation = handlerMethod.getMethod().getAnnotation(NoAuthorization.class);
            if (annotation != null) {
                return true;
            }
        }

        String token = request.getHeader("Authorization");
        token = token.replace("Bearer ", "");
        Admin admin = adminService.queryUserByToken(token);
        if (null == admin) {
            response.setStatus(401); //无权限
            return false;
        }
        admin.setToken(token);
        // 存储到当前的线程中
        UserThreadLocal.set(admin);
        return true;
    }
}
```

WebConfig：

~~~java
package com.tanhua.manage.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {


    @Autowired
    private TokenInterceptor tokenInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //注意拦截器的顺序
        registry.addInterceptor(this.tokenInterceptor).addPathPatterns("/**");
    }
}
~~~

UserThreadLocal：

```java
package com.tanhua.manage.util;

import com.tanhua.manage.pojo.Admin;

public class UserThreadLocal {

    private static final ThreadLocal<Admin> LOCAL = new ThreadLocal<>();

    private UserThreadLocal() {

    }

    public static void set(Admin admin) {
        LOCAL.set(admin);
    }

    public static Admin get() {
        return LOCAL.get();
    }

    public static void remove(){
        LOCAL.remove();
    }
}
```

#### 3.4.4 AdminService

~~~java
    /**
     * 根据token从redis中获取用户信息
     */
    public Admin queryUserByToken(String token) {
        try {
            String redisTokenKey = CACHE_KEY_TOKEN_PREFIX + token;
            String cacheData = this.redisTemplate.opsForValue().get(redisTokenKey);
            if (StrUtil.isEmpty(cacheData)) {
                return null;
            }
            // 刷新时间
            this.redisTemplate.expire(redisTokenKey, 7, TimeUnit.DAYS);
            return MAPPER.readValue(cacheData, Admin.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
~~~

#### 3.5.5 测试

 ![image-20200922213916498](assets/image-20200922213916498.png)

请求参数：

~~~shell
url：http://127.0.0.1:18085/system/users/profile
Authorization: eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiJ9.NP-8K2-W7fOe3LXkK1dehIoCeSx0cniHabBTT6MiXqg
~~~

### 3.5 退出

#### 3.5.1 接口

 ![image-20200922215207553](assets/image-20200922215207553.png)

#### 3.5.2 AdminController

~~~java
    /**
     * 登出
     */
    @PostMapping("logout")
    public Boolean logout() {
        Admin admin = UserThreadLocal.get();
        adminService.removeToken(admin.getToken());
        UserThreadLocal.remove();
        return true;
    }
~~~

#### 3.5.3 AdminService

```java
/**
 * 从redis中删除token缓存
 */
public void removeToken(String token){
    String redisTokenKey = CACHE_KEY_TOKEN_PREFIX + token;
    this.redisTemplate.delete(redisTokenKey);
}
```

#### 3.5.4 测试

基于页面测试即可。

### 3.6 统一异常处理

在后台系统中，统一使用BusinessException进行异常捕获，就需要对该异常做统一的处理。

GlobalExceptionHandler：

~~~java
package com.tanhua.manage.handler;

import com.tanhua.manage.exception.BusinessException;
import com.tanhua.manage.vo.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * 异常的统一处理
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<CommonResponse> handleExcepting(BusinessException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new CommonResponse(e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse> handleExcepting(Exception e) {
        log.error("error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.APPLICATION_JSON).body(new CommonResponse("服务器内部错误"));
    }

}

~~~

CommonResponse：

~~~java
package com.tanhua.manage.vo;

import lombok.Data;

import java.io.Serializable;

@Data
public class CommonResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private String message = "";

    public CommonResponse(final String message) {
        this.message = message;
    }

    public CommonResponse() {

    }
}

~~~

### 3.7 MybatisPlus自动填充

~~~java
package com.tanhua.manage.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        Object created = getFieldValByName("created", metaObject);
        if (null == created) {
            //字段为空，可以进行填充
            setFieldValByName("created", new Date(), metaObject);
        }

        Object updated = getFieldValByName("updated", metaObject);
        if (null == updated) {
            //字段为空，可以进行填充
            setFieldValByName("updated", new Date(), metaObject);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        setFieldValByName("updated", new Date(), metaObject);
    }
}

~~~

## 4 首页

![image-20200923153755527](assets/image-20200923153755527.png)

在首页中，显示各种的数据，比如：累计用户数、新增用户数、登录次数等内容。这些数据是需要基于用户的操作来进行统计的，所以需要建立tb_log表来记录用户的操作。`

基于log表的数据进行计算，将计算的结果保存到tb_analysis_by_day表中。

### 4.1 表结构

~~~sql
CREATE TABLE `tb_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户id',
  `type` varchar(255) NOT NULL COMMENT '操作类型,\r\n01为登录，0201为发动态，0202为浏览动态，0203为动态点赞，0204为动态喜欢，0205为评论，0206为动态取消点赞，0207为动态取消喜欢，0301为发小视频，0302为小视频点赞，0303为小视频取消点赞，0304为小视频评论',
  `log_time` varchar(10) DEFAULT NULL COMMENT '操作日期',
  `place` varchar(255) DEFAULT NULL COMMENT '操作地点',
  `equipment` varchar(255) DEFAULT NULL COMMENT '操作设备',
  `created` datetime DEFAULT NULL COMMENT '创建时间',
  `updated` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `time_type_user` (`log_time`,`type`,`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=152668 DEFAULT CHARSET=utf8 COMMENT='用户日志表';

CREATE TABLE `tb_analysis_by_day` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `record_date` date NOT NULL COMMENT '日期',
  `num_registered` int(8) NOT NULL DEFAULT '0' COMMENT '新注册用户数',
  `num_active` int(8) NOT NULL DEFAULT '0' COMMENT '活跃用户数',
  `num_login` int(8) NOT NULL DEFAULT '0' COMMENT '登陆次数',
  `num_retention1d` int(8) NOT NULL DEFAULT '0' COMMENT '次日留存用户数',
  `created` datetime NOT NULL COMMENT '创建时间',
  `updated` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `record_date` (`record_date`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8;

~~~

### 4.2 登录成功的消息

在sso系统中，用户登录成功后，会向tanhua-sso-login队列发送消息，在后台系统中，需要对该消息进行处理。

#### 4.2.1 转发消息

在接收到登录成功的消息后，需要将该消息进行转发，因为还有其他的操作需要进行记录log操作，所以需要统一起来进行操作。

```java
package com.tanhua.manage.msg;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanhua.manage.enums.LogTypeEnum;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RocketMQMessageListener(topic = "tanhua-sso-login",
        consumerGroup = "tanhua-sso-login-consumer")
@Slf4j
public class LoginMsgConsumer implements RocketMQListener<String> {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    @Override
    public void onMessage(String msg) {
        try {
            Map<String, Object> msgMap = MAPPER.readValue(msg, HashMap.class);
            if (msgMap.containsKey("id")){
                msgMap.put("userId",msgMap.get("id"));
            }
            msgMap.put("type", LogTypeEnum.LOGIN.getValue());

            log.info("收到用户登陆消息，将其转向 tanhua-log topic");
            rocketMQTemplate.convertAndSend("tanhua-log", msgMap);

        } catch (IOException ioException) {
            log.error("消息处理失败!" + ioException.getMessage());
        }
    }
}

```

#### 4.2.2 消息处理

Log对象：

~~~java
package com.tanhua.manage.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Log extends BasePojo {
    /**
     * id
     */
    private Long id;
    /**
     * 用户id
     */
    private Long userId;
    /**
     * 操作时间
     */
    private String logTime;
    /**
     * 登陆地点
     */
    private String place;
    /**
     * 登陆设备
     */
    private String equipment;
    /**
     * 操作类型,
     * 01为登录，0201为发动态，0202为浏览动态，0203为动态点赞，0204为动态喜欢，0205为评论，0206为动态取消点赞，0207为动态取消喜欢，0301为发小视频，0302为小视频点赞，0303为小视频取消点赞，0304为小视频评论
     */
    private String type;
}

~~~

LogMapper：

```java
package com.tanhua.manage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tanhua.manage.pojo.Log;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper extends BaseMapper<Log> {
}
```

LoginLogMsgConsumer：

```java
package com.tanhua.manage.msg;

import cn.hutool.core.convert.Convert;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanhua.manage.pojo.Log;
import com.tanhua.manage.service.LogService;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;

@Component
@RocketMQMessageListener(topic = "tanhua-log",
        consumerGroup = "tanhua-log-consumer")
@Slf4j
public class LogMsgConsumer implements RocketMQListener<String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    // 模拟手机型号
    private static final String[] mockDevices = {
            "华为荣耀P30", "华为荣耀P29", "华为荣耀P28", "华为荣耀P27", "华为荣耀P26", "华为荣耀P25"
    };
    // 模拟操作地点
    private static final String[] mockCities = {
            "北京", "上海", "广州", "深圳", "天津", "石家庄"
    };

    @Autowired
    private LogService logService;

    @Override
    public void onMessage(String msg) {
        try {
            JsonNode jsonNode = MAPPER.readTree(msg);
            long userId = jsonNode.get("userId").asLong();
            String type = jsonNode.get("type").asText();
            Date date = Convert.toDate(jsonNode.get("date").asText(), null);

            if (!ObjectUtil.isAllNotEmpty(userId, type, date)) {
                return;
            }

            //消息的幂等性的校验
            int count = this.logService.count(Wrappers.<Log>lambdaQuery()
                    .eq(Log::getUserId, userId)
                    .eq(Log::getType, type)
                    .eq(Log::getCreated, date)
            );

            if (count > 0) {
                return;
            }

            String logTime = DateUtil.formatDate(date);

            Log log = new Log();
            log.setLogTime(logTime);
            log.setUserId(userId);
            log.setType(type);
            log.setPlace(mockCities[RandomUtil.randomInt(0, mockCities.length - 1)]);
            log.setEquipment(mockDevices[RandomUtil.randomInt(0, mockDevices.length - 1)]);
            log.setCreated(date); //原消息的是时间作为现消息的时间
            this.logService.save(log);

        } catch (IOException e) {
            log.error("处理消息失败！msg = " + msg);
        }
    }
}

```

LogService：

```java
package com.tanhua.manage.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.tanhua.manage.mapper.LogMapper;
import com.tanhua.manage.pojo.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class LogService extends ServiceImpl<LogMapper, Log> {

}
```

### 4.3 定时任务

前面已经将数据写入到tb_log表中，需要使用定时任务，将数据进行统计计算，存储到tb_analysis_by_day表中。

开启定时任务：

~~~java
package com.tanhua.manage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {MongoAutoConfiguration.class, MongoDataAutoConfiguration.class})
@EnableScheduling  //开启基于注解的定时任务
public class ManageApplication {

    public static void main(String[] args) {
        SpringApplication.run(ManageApplication.class, args);
    }

}

~~~

编写定时任务：

~~~java
package com.tanhua.manage.job;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.tanhua.manage.enums.LogTypeEnum;
import com.tanhua.manage.pojo.AnalysisByDay;
import com.tanhua.manage.pojo.Log;
import com.tanhua.manage.pojo.User;
import com.tanhua.manage.service.AnalysisService;
import com.tanhua.manage.service.LogService;
import com.tanhua.manage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class AnalysisJob {

    @Autowired
    private UserService userService;

    @Autowired
    private AnalysisService analysisService;

    @Autowired
    private LogService logService;

//    @Scheduled(cron = "0 0/1 * * * *") //每分执行，用于测试
    @Scheduled(cron = "0 0/30 * * * *") //每30分钟执行
    public void run() {
//        Date today = new Date();
//        String todayStr = DateUtil.formatDate(today);

        //测试
        Date today = DateUtil.parse("2020-09-08");
        String todayStr = "2020-09-08";

        //查询当天的统计对象
        AnalysisByDay analysisByDay = analysisService.getOne(Wrappers.<AnalysisByDay>lambdaQuery().eq(AnalysisByDay::getRecordDate, todayStr));

        if (analysisByDay == null) {
            analysisByDay = new AnalysisByDay();
            analysisByDay.setRecordDate(today);
            this.analysisService.save(analysisByDay);
        }

        //查询当日的活跃数
        int activeCount = this.logService.count(Wrappers.query(Log.builder().logTime(todayStr).build())
                .select("DISTINCT(user_id)"));
        if (activeCount > 0) {
            analysisByDay.setNumActive(activeCount);
        }

        //查询用户登录数据
        List<Log> logList = this.logService.list(Wrappers.query(Log.builder()
                .logTime(todayStr)
                .type(LogTypeEnum.LOGIN.getValue())
                .build()).select("DISTINCT(user_id)")
        );

        if (CollUtil.isNotEmpty(logList)) {
            //今日登录用户
            analysisByDay.setNumLogin(logList.size());

            //统计数据归0，重新计算
            analysisByDay.setNumRegistered(0);
            analysisByDay.setNumRetention1d(0);

            List<User> userList = this.userService.list(Wrappers.<User>lambdaQuery().in(User::getId, CollUtil.getFieldValues(logList, "userId")));
            for (User user : userList) {
                Long days = DateUtil.betweenDay(user.getCreated(), today, true);
                if (days == 0) {
                    //今日注册
                    analysisByDay.setNumRegistered(analysisByDay.getNumRegistered() + 1);
                } else if (days == 1) {
                    //次日留存
                    analysisByDay.setNumRetention1d(analysisByDay.getNumRetention1d() + 1);
                }
            }
        }

        //更新数据
        this.analysisService.updateById(analysisByDay);

    }
}

~~~

User:

~~~java
package com.tanhua.manage.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User extends BasePojo {

    private Long id;
    private String mobile; //手机号

    @JsonIgnore
    private String password; //密码，json序列化时忽略

}

~~~

UserService：

~~~java
package com.tanhua.manage.service;

        import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
        import com.tanhua.manage.mapper.UserMapper;
        import com.tanhua.manage.pojo.User;
        import lombok.extern.slf4j.Slf4j;
        import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService extends ServiceImpl<UserMapper, User> {
}

~~~

UserMapper：

~~~java
package com.tanhua.manage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tanhua.manage.pojo.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}

~~~

AnalysisService：

~~~java
package com.tanhua.manage.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.tanhua.manage.mapper.AnalysisByDayMapper;
import com.tanhua.manage.pojo.AnalysisByDay;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AnalysisService extends ServiceImpl<AnalysisByDayMapper, AnalysisByDay> {
}

~~~

AnalysisByDayMapper：

~~~java
package com.tanhua.manage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tanhua.manage.pojo.AnalysisByDay;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AnalysisByDayMapper extends BaseMapper<AnalysisByDay> {
}

~~~

AnalysisByDay：

```java
package com.tanhua.manage.pojo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisByDay extends BasePojo {
    private Long id;
    /**
     * 日期
     */
    private Date recordDate;
    /**
     * 新注册用户数
     */
    private Integer numRegistered = 0;
    /**
     * 活跃用户数
     */
    private Integer numActive = 0;
    /**
     * 登陆次数
     */
    private Integer numLogin = 0;
    /**
     * 次日留存用户数
     */
    private Integer numRetention1d = 0;
}
```

### 4.4 概要统计信息

#### 4.4.1 接口

 ![image-20200925114000280](assets/image-20200925114000280.png)

返回数据：

| 名称                     | 类型    | 是否必须 | 默认值 | 备注                                               | 其他信息                     |
| :----------------------- | :------ | :------- | :----- | :------------------------------------------------- | :--------------------------- |
| cumulativeUsers          | integer | 必须     |        | 累计用户                                           | **最大值:** 500**最小值:** 0 |
| activePassMonth          | integer | 必须     |        | 过去30天活跃用户                                   | **最大值:** 500**最小值:** 0 |
| activePassWeek           | integer | 必须     |        | 过去7天活跃用户                                    | **最大值:** 500**最小值:** 0 |
| newUsersToday            | integer | 必须     |        | 今日新增用户                                       | **最大值:** 500**最小值:** 0 |
| newUsersTodayRate        | integer | 必须     |        | 今日新增用户涨跌率，单位百分数，正数为涨，负数为跌 |                              |
| loginTimesToday          | integer | 必须     |        | 今日登录次数                                       | **最大值:** 500**最小值:** 0 |
| loginTimesTodayRate      | integer | 必须     |        | 今日登录次数涨跌率，单位百分数，正数为涨，负数为跌 |                              |
| activeUsersToday         | integer | 必须     |        | 今日活跃用户                                       | **最大值:** 500**最小值:** 0 |
| activeUsersTodayRate     | integer | 必须     |        | 今日活跃用户涨跌率，单位百分数，正数为涨，负数为跌 |                              |
| useTimePassWeek          | integer | 必须     |        | 过去7天平均日使用时长，单位秒                      |                              |
| activeUsersYesterday     | integer | 必须     |        | 昨日活跃用户                                       |                              |
| activeUsersYesterdayRate | integer | 必须     |        | 昨日活跃用户涨跌率，单位百分数，正数为涨，负数为跌 |                              |

#### 4.4.2 AnalysisController

```java
package com.tanhua.manage.controller;

import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.RandomUtil;
import com.tanhua.manage.service.AnalysisService;
import com.tanhua.manage.service.UserService;
import com.tanhua.manage.util.ComputeUtil;
import com.tanhua.manage.vo.AnalysisSummaryVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class AnalysisController {

    @Autowired
    private UserService userService;
    @Autowired
    private AnalysisService analysisService;

    /**
     * 概要统计信息
     *
     * @return
     */
    @GetMapping("/dashboard/summary")
    public AnalysisSummaryVo getSummary() {
        AnalysisSummaryVo analysisSummaryVo = new AnalysisSummaryVo();
//        DateTime dateTime = DateUtil.date();
        DateTime dateTime = DateUtil.parseDate("2020-09-08");

        //累计用户数
        analysisSummaryVo.setCumulativeUsers(Long.valueOf(this.userService.count()));

        //过去30天活跃用户
        analysisSummaryVo.setActivePassMonth(this.analysisService.queryActiveUserCount(dateTime, -30));

        //过去7天活跃用户
        analysisSummaryVo.setActivePassWeek(this.analysisService.queryActiveUserCount(dateTime, -7));

        //今日活跃用户
        analysisSummaryVo.setActiveUsersToday(this.analysisService.queryActiveUserCount(dateTime, 0));

        //昨日活跃用户
        analysisSummaryVo.setActiveUsersYesterday(this.analysisService.queryActiveUserCount(dateTime, -1));

        //今日新增用户
        analysisSummaryVo.setNewUsersToday(this.analysisService.queryRegisterUserCount(dateTime, 0));

        //今日新增用户涨跌率，单位百分数，正数为涨，负数为跌
        analysisSummaryVo.setNewUsersTodayRate(ComputeUtil.computeRate(
                analysisSummaryVo.getNewUsersToday(),
                this.analysisService.queryRegisterUserCount(dateTime, -1)
        ));

        //今日登录次数
        analysisSummaryVo.setLoginTimesToday(this.analysisService.queryLoginUserCount(dateTime, 0));

        //今日登录次数涨跌率，单位百分数，正数为涨，负数为跌
        analysisSummaryVo.setLoginTimesTodayRate(ComputeUtil.computeRate(
                analysisSummaryVo.getLoginTimesToday(),
                this.analysisService.queryLoginUserCount(dateTime, -1)
        ));

        //今日活跃用户涨跌率，单位百分数，正数为涨，负数为跌
        analysisSummaryVo.setActiveUsersTodayRate(ComputeUtil.computeRate(
                analysisSummaryVo.getActiveUsersToday(),
                analysisSummaryVo.getActiveUsersYesterday()
        ));

        //过去7天平均日使用时长，单位秒，没有数据，随机生成
        analysisSummaryVo.setUseTimePassWeek(RandomUtil.randomLong(600));

        //昨日活跃用户涨跌率，单位百分数，正数为涨，负数为跌
        analysisSummaryVo.setActiveUsersYesterdayRate(ComputeUtil.computeRate(
                analysisSummaryVo.getActiveUsersYesterday(),
                this.analysisService.queryActiveUserCount(dateTime, -2)
        ));

        return analysisSummaryVo;

    }
}
```

~~~java
package com.tanhua.manage.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalysisSummaryVo {
    /**
     * 累计用户数
     */
    private Long cumulativeUsers;
    /**
     * 过去30天活跃用户数
     */
    private Long activePassMonth;
    /**
     * 过去7天活跃用户
     */
    private Long activePassWeek;
    /**
     * 今日新增用户数量
     */
    private Long newUsersToday;
    /**
     * 今日新增用户涨跌率，单位百分数，正数为涨，负数为跌
     */
    private BigDecimal newUsersTodayRate;
    /**
     * 今日登录次数
     */
    private Long loginTimesToday;
    /**
     * 今日登录次数涨跌率，单位百分数，正数为涨，负数为跌
     */
    private BigDecimal loginTimesTodayRate;
    /**
     * 今日活跃用户数量
     */
    private Long activeUsersToday;
    /**
     * 今日活跃用户涨跌率，单位百分数，正数为涨，负数为跌
     */
    private BigDecimal activeUsersTodayRate;
    /**
     * 过去7天平均日使用时长，单位秒
     */
    private Long useTimePassWeek;
    /**
     * 昨日活跃用户
     */
    private Long activeUsersYesterday;
    /**
     * 昨日活跃用户涨跌率，单位百分数，正数为涨，负数为跌
     */
    private BigDecimal activeUsersYesterdayRate;
}

~~~



#### 4.4.3 AnalysisService

```java
package com.tanhua.manage.service;

import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.tanhua.manage.mapper.AnalysisByDayMapper;
import com.tanhua.manage.pojo.AnalysisByDay;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AnalysisService extends ServiceImpl<AnalysisByDayMapper, AnalysisByDay> {

    /**
     * 查询活跃用户的数量
     *
     * @param today 今日时间对象
     * @param offset 偏移量
     * @return
     */
    public Long queryActiveUserCount(DateTime today, int offset) {
        return this.queryUserCount(today, offset, "num_active");
    }

    /**
     * 查询注册用户的数量
     *
     * @param today 今日时间对象
     * @param offset 偏移量
     * @return
     */
    public Long queryRegisterUserCount(DateTime today, int offset) {
        return this.queryUserCount(today, offset, "num_registered");
    }

    /**
     * 查询登录用户的数量
     *
     * @param today 今日时间对象
     * @param offset 偏移量
     * @return
     */
    public Long queryLoginUserCount(DateTime today, int offset) {
        return this.queryUserCount(today, offset, "num_login");
    }

    private Long queryUserCount(DateTime today, int offset, String column){
        AnalysisByDay analysisByDay = super.getOne(Wrappers.<AnalysisByDay>query()
                .select("SUM("+column+") AS num_active")
                .le("record_date", today.toDateStr())
                .ge("record_date", DateUtil.offsetDay(today, offset).toDateStr())
        );
        return Long.valueOf(analysisByDay.getNumActive());
    }
}
```

#### 4.4.4 ComputeUtil

```java
package com.tanhua.manage.util;

import java.math.BigDecimal;

public class ComputeUtil {
    /**
     * 计算环比
     *
     * @param current 本期计数
     * @param last    上一期计数
     * @return 环比
     */
    public static BigDecimal computeRate(Long current, Long last) {
        BigDecimal result;
        if (last == 0) {
            // 当上一期计数为零时，此时环比增长为倍数增长
            result = new BigDecimal((current - last) * 100);
        } else {
            result = BigDecimal.valueOf((current - last) * 100).divide(BigDecimal.valueOf(last), 2, BigDecimal.ROUND_HALF_DOWN);
        }
        return result;
    }
}
```

#### 4.4.5 测试

 ![image-20200925114228307](assets/image-20200925114228307.png)

效果：

![image-20200925114256489](assets/image-20200925114256489.png)

### 4.5 新增、活跃用户、次日留存率

#### 4.5.1 接口

 ![image-20200927114033032](assets/image-20200927114033032.png)

返回数据：

| 名称     | 类型      | 是否必须 | 默认值 | 备注 | 其他信息                                                     |
| :------- | :-------- | :------- | :----- | :--- | :----------------------------------------------------------- |
| thisYear | object [] | 必须     |        | 本年 | **最小数量:** 12**元素是否都不同:** true**最大数量:** 12**item 类型:** object |
| title    | string    | 必须     |        | 日期 | **枚举:** 1,2,3,4,5,6,7,8,9,10,11,12                         |
| amount   | integer   | 必须     |        | 数量 | **最大值:** 9999**最小值:** 50                               |
| lastYear | object [] | 必须     |        | 去年 | **最小数量:** 12**元素是否都不同:** true**最大数量:** 12**item 类型:** object |
| title    | string    | 必须     |        | 日期 | **枚举:** 1,2,3,4,5,6,7,8,9,10,11,12                         |
| amount   | integer   | 必须     |        | 数量 | **最大值:** 9999**最小值:** 50                               |

#### 4.5.2 AnalysisUsersVo

~~~java
package com.tanhua.manage.vo;

import lombok.Data;

import java.util.List;

@Data
public class AnalysisUsersVo {
    /**
     * 本年
     */
    private List<DataPointVo> thisYear;
    /**
     * 去年
     */
    private List<DataPointVo> lastYear;
}

~~~

```java
package com.tanhua.manage.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataPointVo {
    /**
     * 数据点名称
     */
    private String title;
    /**
     * 数量
     */
    private Long amount;
}
```

#### 4.5.3 AnalysisController

```java
/**
 * 新增、活跃用户、次日留存率
 *
 * @param sd   开始时间
 * @param ed   结束时间
 * @param type 101 新增 102 活跃用户 103 次日留存率
 * @return 新增 or 活跃用户 or 次日留存率
 */
@GetMapping("/dashboard/users")
public AnalysisUsersVo getUsers(@RequestParam(name = "sd") Long sd
        , @RequestParam("ed") Long ed
        , @RequestParam("type") Integer type) {
    return this.analysisService.queryAnalysisUsersVo(sd, ed, type);
}
```

#### 4.5.4 AnalysisService

```java
/**
 * 新增、活跃用户、次日留存率
 *
 * @param sd
 * @param ed
 * @param type
 * @return
 */
public AnalysisUsersVo queryAnalysisUsersVo(Long sd, Long ed, Integer type) {
    DateTime startDate = DateUtil.date(sd);
    DateTime endDate = DateUtil.date(ed);

    AnalysisUsersVo analysisUsersVo = new AnalysisUsersVo();

    //今年数据
    analysisUsersVo.setThisYear(this.queryDataPointVos(startDate, endDate, type));
    //去年数据
    analysisUsersVo.setLastYear(this.queryDataPointVos(
            DateUtil.offset(startDate, DateField.YEAR, -1),
            DateUtil.offset(endDate, DateField.YEAR, -1),
            type)
    );

    return analysisUsersVo;
}

private List<DataPointVo> queryDataPointVos(DateTime sd, DateTime ed, Integer type) {
    String startDate = sd.toDateStr();
    String endDate = ed.toDateStr();

    String column = null;
    switch (type) { //101 新增 102 活跃用户 103 次日留存率
        case 101:
            column = "num_registered";
            break;
        case 102:
            column = "num_active";
            break;
        case 103:
            column = "num_retention1d";
            break;
        default:
            column = "num_active";
            break;
    }

    List<AnalysisByDay> analysisByDayList = super.list(Wrappers.<AnalysisByDay>query()
            .select("record_date , " + column + " as num_active")
            .ge("record_date", startDate)
            .le("record_date", endDate));

    return analysisByDayList.stream()
            .map(analysisByDay -> new DataPointVo(DateUtil.date(analysisByDay.getRecordDate()).toDateStr(), analysisByDay.getNumActive().longValue()))
            .collect(Collectors.toList());
}
```

#### 4.5.5、测试

```java
package com.tanhua.manage.service;

import com.tanhua.manage.vo.AnalysisUsersVo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
public class TestAnalysisService {

    @Autowired
    private AnalysisService analysisService;

    @Test
    public void testQueryAnalysisUsersVo() {
        AnalysisUsersVo analysisUsersVo = this.analysisService.queryAnalysisUsersVo(1598580158301L, 1601172158301L, 101);
        analysisUsersVo.getThisYear().forEach(dataPointVo -> System.out.println(dataPointVo.getTitle() +":" + dataPointVo.getAmount()));
        System.out.println("-------------------");
        analysisUsersVo.getLastYear().forEach(dataPointVo -> System.out.println(dataPointVo.getTitle() +":" + dataPointVo.getAmount()));
    }

}
```

结果：

~~~shell
2020-08-28:561
2020-08-29:374
2020-08-30:793
2020-08-31:755
2020-09-01:306
2020-09-02:337
2020-09-03:115
2020-09-04:447
2020-09-05:94
2020-09-25:1
-------------------
2019-08-28:291
2019-08-29:365
2019-08-30:253
2019-08-31:709
2019-09-01:977
2019-09-02:971
2019-09-03:303
2019-09-04:292
2019-09-05:102
2019-09-06:372
2019-09-07:934

........................
~~~

### 4.6 注册用户分布，行业top、年龄、性别、地区

#### 4.6.1 接口

 ![image-20200927163429826](assets/image-20200927163429826.png)

返回数据：

| 名称                 | 类型      | 是否必须 | 默认值 | 备注          | 其他信息                                                     |
| :------------------- | :-------- | :------- | :----- | :------------ | :----------------------------------------------------------- |
| industryDistribution | object [] | 必须     |        | 行业分布TOP10 | **最小数量:** 10**元素是否都不同:** true**最大数量:** 10**item 类型:** object |
| title                | string    | 必须     |        | 行业名称      | **枚举:** 制造,服务,地产,住宿,教育,餐饮,                     |
| amount               | integer   | 必须     |        | 数量          | **最大值:** 50**最小值:** 1                                  |
| ageDistribution      | object [] | 必须     |        | 年龄分布      | **最小数量:** 6**元素是否都不同:** true**最大数量:** 6**item 类型:** object |
| title                | string    | 必须     |        | 年龄段        | **枚举:** 0-17岁,18-23岁,24-30岁,31-40岁,41-50岁,50岁+       |
| amount               | integer   | 必须     |        | 数量          | **最大值:** 9999**最小值:** 50                               |
| genderDistribution   | object [] | 必须     |        | 性别分布      | **最小数量:** 2**元素是否都不同:** true**最大数量:** 2**item 类型:** object |
| title                | string    | 必须     |        | 性别          | **枚举:** 男性用户,女性用户                                  |
| amount               | integer   | 必须     |        | 数量          | **最大值:** 9999**最小值:** 50                               |
| localDistribution    | object [] | 必须     |        | 地区分布      | **最小数量:** 33**元素是否都不同:** true**最大数量:** 33**item 类型:** object |
| title                | string    | 必须     |        | 地区          | **枚举:** 上海,河北,山西,内蒙古,辽宁,吉林,黑龙江,江苏,浙江,安徽,福建,江西,山东,河南,湖北,湖南,广东,广西,海南,四川,贵州,云南,西藏,陕西,甘肃,青海,宁夏,新疆,北京,天津,重庆,香港,澳门 |
| amount               | integer   | 必须     |        | 数量          | **最大值:** 9999**最小值:** 50                               |
| localTotal           | object [] | 必须     |        | 地区合计      | **最小数量:** 5**元素是否都不同:** true**最大数量:** 6**item 类型:** object |
| title                | string    | 必须     |        | 地区名称      | **枚举:** 华南地区,华北地区,华东地区,华西地区,华中地区       |
| amount               | integer   | 必须     |        | 合计数量      | **最大值:** 99**最小值:** 20                                 |

#### 4.6.2 枚举

```java
package com.tanhua.manage.enums;

public enum AgeRangeEnum {

    UNDER_TWENTY(0, 20, "20以下"),
    TWENTY(20, 30, "20-29岁"),
    THIRTY(30, 40, "30-39岁"),
    FORTY(40, 50, "40-50岁"),
    OVER_FIFTY(50, 200, "50以上");

    private int min;
    private int max;
    private String desc;

    AgeRangeEnum(int min, int max, String desc) {
        this.min = min;
        this.max = max;
        this.desc = desc;
    }

    public int getMin() {
        return min;
    }

    public int getMax() {
        return max;
    }

    public String getDesc() {
        return desc;
    }
}
```

```java
package com.tanhua.manage.enums;

public enum AreaEnum {
    // 华中
    HUBEI("湖北", "华中地区"),
    HUNAN("湖南", "华中地区"),
    HENAN("河南", "华中地区"),
    //华北
    SHANXI("山西", "华北地区"),
    HEBEI("河北", "华北地区"),
    BEIJING("北京", "华北地区"),
    TIANJIN("天津", "华北地区"),
    NEIMENGGU("内蒙古", "华北地区"),
    // 华东
    ZHEJIANG("浙江", "华东地区"),
    ANHUI("安徽", "华东地区"),
    SHANGHAI("上海", "华东地区"),
    JIANGXI("江西", "华东地区"),
    SHANDONG("山东", "华东地区"),
    JIANGSU("江苏", "华东地区"),
    FUJIAN("福建", "华东地区"),
    TAIWAN("台湾", "华东地区"),
    // 华南
    GUANGXI("广西", "华南地区"),
    GUANGDONG("广东", "华南地区"),
    HAINAN("海南", "华南地区"),
    HONGKONG("香港", "华南地区"),
    MACAO("澳门", "华南地区"),
    // 西北
    QINGHAI("青海", "西北地区"),
    NINGXIA("宁夏", "西北地区"),
    SHANXI2("陕西", "西北地区"),
    GANSU("甘肃", "西北地区"),
    XINJIANG("新疆", "西北地区"),
    // 东北
    JILIN("吉林", "东北地区"),
    HEILONGJIANG("黑龙江", "东北地区"),
    LIAONING("辽宁", "东北地区"),
    // 西南
    GUIZHOU("贵州", "西南地区"),
    YUNNAN("云南", "西南地区"),
    CHONGQING("重庆", "西南地区"),
    SICHUAN("四川", "西南地区"),
    TIBET("西藏", "西南地区"),
    ;
    private String province;
    private String area;

    AreaEnum(String province, String area) {
        this.province = province;
        this.area = area;
    }

    public String getProvince() {
        return province;
    }

    public String getArea() {
        return area;
    }

    public static String getAreaByProvince(String province) {
        String area = "未知";
        for (AreaEnum areaEnum : values()) {
            if (areaEnum.province == province) {
                area = areaEnum.area;
                break;
            }
        }
        return area;
    }
}
```

~~~java
package com.tanhua.manage.enums;

import com.baomidou.mybatisplus.core.enums.IEnum;

public enum SexEnum implements IEnum<Integer> {

    MAN(1, "男"),
    WOMAN(2, "女"),
    UNKNOWN(3, "未知");

    private int value;
    private String desc;

    SexEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    @Override
    public Integer getValue() {
        return this.value;
    }

    @Override
    public String toString() {
        return this.desc;
    }


    public static String getSexByValue(int code) {
        String sex = "未知";
        for (SexEnum sexEnum : values()) {
            if (sexEnum.value == code) {
                sex = sexEnum.desc;
            }
        }
        return sex;
    }

}

~~~

#### 4.6.3 AnalysisController

```java
/**
 * 注册用户分布，行业top、年龄、性别、地区
 *
 * @param sd 开始时间
 * @param ed   结束时间
 * @return 注册用户分布，行业top、年龄、性别、地区
 */
@GetMapping("/dashboard/distribution")
public AnalysisDistributionVo queryUserDistribution(@RequestParam(name = "sd") Long sd
        , @RequestParam("ed") Long ed) {
    return this.analysisService.queryUserDistribution(sd, ed);
}
```

~~~java
package com.tanhua.manage.vo;

import lombok.Data;

import java.util.List;

@Data
public class AnalysisDistributionVo {
    /**
     * 行业分布TOP10
     */
    private List<DataPointVo> industryDistribution;
    /**
     * 年龄分布
     */
    private List<DataPointVo> ageDistribution;
    /**
     * 性别分布
     */
    private List<DataPointVo> genderDistribution;
    /**
     * 地区分布
     */
    private List<DataPointVo> localDistribution;
    /**
     * 地区合计
     */
    private List<DataPointVo> localTotal;
}

~~~



#### 4.6.4 AnalysisService

```java
 private static final String[] LOCALS = {"上海", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "江苏"
            , "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "四川"
            , "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "北京", "天津", "重庆", "香港", "澳门", "台湾", "南海诸岛"};

/**
 * 注册用户分布，行业top、年龄、性别、地区
 *
 * @param sd 开始时间
 * @param ed 结束时间
 * @return 注册用户分布，行业top、年龄、性别、地区
 */
public AnalysisDistributionVo queryUserDistribution(Long sd, Long ed) {
    String startDate = DateUtil.date(sd).toDateStr();
    String endDate = DateUtil.date(ed).toDateStr();

    AnalysisDistributionVo analysisDistributionVo = new AnalysisDistributionVo();

    //行业top10
    analysisDistributionVo.setIndustryDistribution(this.userInfoMapper.findIndustryDistribution(startDate, endDate));

    //性别
    analysisDistributionVo.setGenderDistribution(this.userInfoMapper.findGenderDistribution(startDate, endDate)
            .stream().map(dataPointVo -> {
                dataPointVo.setTitle(SexEnum.getSexByValue(Integer.valueOf(dataPointVo.getTitle())));
                return dataPointVo;
            }).collect(Collectors.toList()));

    //年龄
    analysisDistributionVo.setAgeDistribution(new ArrayList<>());
    for (AgeRangeEnum ageRangeEnum : AgeRangeEnum.values()) {
        Long amount = userInfoMapper.countByAge(ageRangeEnum.getMin(), ageRangeEnum.getMax(), startDate, endDate);
        analysisDistributionVo.getAgeDistribution().add(new DataPointVo(ageRangeEnum.getDesc(), amount));
    }

    //地区
    analysisDistributionVo.setLocalDistribution(new ArrayList<>());
    for (String local : LOCALS) {
        Long amount = userInfoMapper.countByProvince(local + "%", startDate, endDate);
        analysisDistributionVo.getLocalDistribution().add(new DataPointVo(local, amount));
    }

    // 地区汇总数据
    Map<String, Long> areaMap = new HashMap<>();
    analysisDistributionVo.getLocalDistribution().forEach(dataPoint -> {
        String area = AreaEnum.getAreaByProvince(dataPoint.getTitle());
        areaMap.put(area, MapUtil.getLong(areaMap, area, 0L) + dataPoint.getAmount());
    });

    analysisDistributionVo.setLocalTotal(
            areaMap.entrySet().stream()
                    .map(entry -> new DataPointVo(entry.getKey(), entry.getValue()))
                    .sorted(Comparator.comparing(DataPointVo::getAmount).reversed())
                    .collect(Collectors.toList()));

    return analysisDistributionVo;
}
```

#### 4.6.5 Mapper

UserInfoMapper：

~~~java
package com.tanhua.manage.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.tanhua.manage.pojo.UserInfo;
import com.tanhua.manage.vo.DataPointVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserInfoMapper extends BaseMapper<UserInfo> {

    List<DataPointVo> findIndustryDistribution(@Param("start") String start, @Param("end") String end);

    List<DataPointVo> findGenderDistribution(@Param("start") String start, @Param("end") String end);

    Long countByAge(@Param("min") Integer min, @Param("max") Integer max, @Param("start") String start, @Param("end") String end);

    Long countByProvince(@Param("local") String local, @Param("start") String start, @Param("end") String end);

}

~~~

UserInfoMapper.xml：

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.tanhua.manage.mapper.UserInfoMapper">

    <select id="findIndustryDistribution" resultType="com.tanhua.manage.vo.DataPointVo">
        SELECT tui.industry AS title,count(tui.id) AS amount FROM tb_user_info tui
        LEFT JOIN tb_user tu ON tui.user_id = tu.id
        <where>
            <if test="start !=null and start != ''">
                AND tu.created &gt;= #{start}
            </if>
            <if test="end !=null and end != ''">
                AND tu.created &lt;= #{end}
            </if>
        </where>
        GROUP BY tui.industry ORDER BY amount DESC LIMIT 10
    </select>

    <select id="findGenderDistribution" resultType="com.tanhua.manage.vo.DataPointVo">
        SELECT tui.sex AS title,count(tui.id) AS amount FROM tb_user_info tui
        LEFT JOIN tb_user tu ON tui.user_id = tu.id
        <where>
            <if test="start !=null and start != ''">
                AND tu.created &gt;= #{start}
            </if>
            <if test="end !=null and end != ''">
                AND tu.created &lt;= #{end}
            </if>
        </where>
        GROUP BY tui.sex ORDER BY amount DESC
    </select>

    <select id="countByProvince" resultType="java.lang.Long">
        SELECT count(tui.id) FROM tb_user_info tui LEFT JOIN tb_user tu ON tui.user_id = tu.id
        <where>
            tui.city LIKE #{local}
            <if test="start !=null and start != ''">
                AND tu.created &gt;= #{start}
            </if>
            <if test="end !=null and end != ''">
                AND tu.created &lt;= #{end}
            </if>
        </where>
    </select>

    <select id="countByAge" resultType="java.lang.Long">
        SELECT count(tui.id) FROM tb_user_info tui LEFT JOIN tb_user tu ON tui.user_id = tu.id
        <where>
            <if test="min !=null">
                AND tui.age &gt;= #{min}
            </if>
            <if test="max !=null">
                AND tui.age &lt; #{max}
            </if>
            <if test="start !=null and start != ''">
                AND tu.created &gt;= #{start}
            </if>
            <if test="end !=null and end != ''">
                AND tu.created &lt;= #{end}
            </if>
        </where>
    </select>

</mapper>

~~~

#### 4.6.6 测试用例

```java
@Test
public void testQueryUserDistribution(){
    AnalysisDistributionVo analysisDistributionVo = this.analysisService.queryUserDistribution(1598580158301L, 1601172158301L);
    analysisDistributionVo.getIndustryDistribution().forEach(dataPointVo -> System.out.println(dataPointVo.getTitle() +":" + dataPointVo.getAmount()));

    System.out.println("-------------------");
    analysisDistributionVo.getGenderDistribution().forEach(dataPointVo -> System.out.println(dataPointVo.getTitle() +":" + dataPointVo.getAmount()));

    System.out.println("-------------------");
    analysisDistributionVo.getAgeDistribution().forEach(dataPointVo -> System.out.println(dataPointVo.getTitle() +":" + dataPointVo.getAmount()));

    System.out.println("-------------------");
    analysisDistributionVo.getLocalDistribution().forEach(dataPointVo -> System.out.println(dataPointVo.getTitle() +":" + dataPointVo.getAmount()));

    System.out.println("-------------------");
    analysisDistributionVo.getLocalTotal().forEach(dataPointVo -> System.out.println(dataPointVo.getTitle() +":" + dataPointVo.getAmount()));
}
```

结果：

~~~shell
餐饮:40
住宿:38
地产:37
物流:37
金融:37
教育:36
医疗:34
文娱:34
服务:32
制造:29
-------------------
男:129
未知:116
女:109
-------------------
20以下:110
20-29岁:66
30-39岁:61
40-50岁:58
50以上:59
-------------------
上海:12
河北:13
山西:12
内蒙古:12
辽宁:7
吉林:8
黑龙江:13
江苏:8
浙江:12
安徽:6
福建:12
江西:16
山东:5
河南:9
湖北:10
湖南:5
广东:5
广西:9
海南:11
四川:12
贵州:7
云南:7
西藏:7
陕西:9
甘肃:14
青海:12
宁夏:11
新疆:11
北京:23
天津:12
重庆:8
香港:13
澳门:17
台湾:6
南海诸岛:0
-------------------
华东地区:77
华北地区:72
西北地区:57
华南地区:55
西南地区:41
东北地区:28
华中地区:24
未知:0
~~~

#### 4.6.7 整合测试

![image-20200927165316977](assets/image-20200927165316977.png)

![image-20200927165332389](assets/image-20200927165332389.png)