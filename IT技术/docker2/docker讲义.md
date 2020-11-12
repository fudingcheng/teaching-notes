## 1. 初始docker

### 1.1 docker概念

我们写的代码会接触到好几个环境：开发环境、测试环境以及生产环境

![1592741447865](images\1592741447865.png)

* Docker 是一个开源的应用容器引擎

* 诞生于 2013 年初，基于 Go 语言实现， dotCloud 公司出品（后改名为Docker Inc） 
* Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上
* 容器是完全使用沙箱机制，相互隔离
* 容器性能开销极低
* Docker 从 17.03 版本之后分为 CE（Community Edition: 社区版） 和 EE（Enterprise Edition: 企业版）

### 1.2 安装docker

Docker可以运行在MAC、Windows、CentOS、UBUNTU等操作系统上，本课程基于CentOS 7 安装

Docker官网：https://www.docker.com

~~~shell
# 1、yum 包更新到最新 
yum update
# 2、安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的 
yum install -y yum-utils device-mapper-persistent-data lvm2
# 3、 设置yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 4、 安装docker，出现输入的界面都按 y 
yum install -y docker-ce
# 5、 查看docker版本，验证是否验证成功
docker -v
~~~

### 1.3 docker架构

![1592741985974](images\1592741985974.png)

* **镜像（Image）：**Docker 镜像（Image），就相当于是 一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包 含了完整的一套 Ubuntu16.04 最小系统的 root 文件系 统。
* **容器（Container）**：镜像（Image）和容器（Contain er）的关系，就像是面向对象程序设计中的类和对象一 样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。 
* **仓库（Repository）**：仓库可看成一个镜像中心，仓库有公共仓库dockerhub和私有仓库两种。

### 1.4 配置 Docker 镜像加速器

默认情况下，将来从docker hub（https://hub.docker.com/）上下载 docker镜像，但是太慢，所以一般都会配置镜像加速器：

* USTC：中科大镜像加速器（https://docker.mirrors.ustc.edu.cn） 

* 阿里云 

* 网易云 

* 腾讯云

本次我们使用阿里云镜像

1.登录阿里云网站（https://www.aliyun.com/）

![1592742973168](images\1592742973168.png)

2.  查看文件/etc/docker/daemon.json

~~~shell
# 执行如下命令： 
cat /etc/docker/daemon.json
~~~

![1592743065182](images\1592743065182.png)



## 2. docker命令

### 2.1 进程相关命令

#### 2.1.1 启动docker

~~~shell
systemctl start docker
~~~

#### 2.1.2 停止docker

~~~shell
systemctl stop docker
~~~

#### 2.1.3 重启docker

~~~shell
systemctl restart docker
~~~

#### 2.1.4 查看docker

~~~shell
systemctl status docker
~~~

#### 2.1.5 开机启动docker

~~~shell
systemctl enable docker
~~~



![1592743261888](images\1592743261888.png)

### 2.2 Docker 镜像相关命令

#### 2.2.1 查看镜像

* 查看本地所有的镜像

~~~shell
docker images
docker images –q # 查看所用镜像的id
~~~

![1592743915716](images\1592743915716.png)

> REPOSITORY：镜像名称 
> TAG：镜像标签 
> IMAGE ID：镜像ID 
> CREATED：镜像的创建日期 
> SIZE：镜像大小

#### 2.2.2 搜索镜像

* 从网络中查找需要的镜像

~~~shell
docker search 镜像名称
~~~

![1592744016271](images\1592744016271.png)

> NAME：镜像名称 
> DESCRIPTION：镜像描述 
> STARS：用户评价，反应一个镜像的受欢迎程度 
> OFFICIAL：是否官方 
> AUTOMATED：自动构建，表示该镜像由Docker Hub自动构建流程创建的 

#### 2.2.3 拉取镜像

从Docker仓库下载镜像到本地，镜像名称格式为 名称:版本号，如果版本号不指定则是最新的版本。 如果不知道镜像版本，可以去docker hub 搜索对应镜像查看。 

~~~shell
docker pull 镜像名称
~~~

#### 2.2.4 删除镜像

 删除本地镜像

~~~shell
docker rmi 镜像id # 删除指定本地镜像
docker rmi `docker images -q` # 删除所有本地镜像
~~~

关于docker更多命令， 大家可以菜鸟教程查看, 网址：

https://www.runoob.com/docker/docker-command-manual.html

###  2.3 容器相关的命令

#### 2.3.1 查看容器

~~~shell
docker ps # 查看正在运行的容器
docker ps –a # 查看所有容器，包括正在运行和停止的容器
~~~

#### 2.3.2 创建并启动容器

~~~shell
docker run 参数
~~~

**参数说明：**

* -i：保持容器运行。通常与 -t 同时使用。加入it这两个参数后，容器创建后自动进入容器中，退出容器后，容器自动关闭。 

* -t：为容器重新分配一个伪输入终端，通常与 -i 同时使用。 

* -d：以守护（后台）模式运行容器。创建一个容器在后台运行，需要使用docker exec 进入容器。退出后，容器不会关闭。 

*  -it 创建的容器一般称为交互式容器，-id 创建的容器一般称为守护式容器 

*  --name：为创建的容器命名

##### 1）交互式容器 

以**交互式**方式创建并启动容器，启动完成后，直接进入当前容器。使用exit命令退出容器。需要注意的是以此种方式 启动容器，如果退出容器，则容器会进入**停止**状态。 

~~~shell
# 先拉取一个镜像；这一步不是每次启动容器都要做的，而是因为前面我们删除了镜像，无镜像可用所以才再拉取一个 
docker pull centos:7 

#创建并启动名称为 mycentos7 的交互式容器；下面指令中的镜像名称 centos:7 也可以使用镜像id 
docker run -it --name=mycentos7 centos:7 /bin/bash
~~~

##### 2）守护式容器

创建一个守护式容器；如果对于一个需要长期运行的容器来说，我们可以创建一个守护式容器。命令如下（容器名称 不能重复）：

~~~shell
#创建并启动守护式容器
docker run -di --name=mycentos2 centos:7

#登录进入容器命令为：docker exec -it container_name (或者 container_id) /bin/bash（exit退出 时，容器不会停止）
docker exec -it mycentos2 /bin/bash
~~~

#### 2.3.3 进入容器

~~~shell
docker exec 参数 # 退出容器，容器不会关闭
eg: 
docker exec -it mycentos2 /bin/bash
~~~

#### 2.3.4 停止容器

~~~shell
docker stop 容器名称或者容器id
~~~

#### 2.3.5 启动容器

~~~shell
docker start 容器名称或者容器id
~~~

#### 2.3.6 删除容器

~~~shell
#删除指定容器
docker rm 容器名称或者容器id

# 删除所有容器：
docker rm `docker ps -a -q`
~~~

**注意：如果容器是运行状态则删除失败，需要停止容器才能删除**

#### 2.3. 7 查看容器信息

~~~shell
docker inspect 容器名称或者容器id
~~~

![1592745823262](images\1592745823262.png)

说明：

==1. 容器之间在一个局域网内，linux宿主机器可以与容器进行通信==；

==2. 外部的物理机笔记本是不能与容器直接通信的，如果需要则需要通过宿主机器端口的代理。== 

## 3 . docker容器的数据卷

### 3.1 数据卷概念

思考：

1. Docker 容器删除后，在容器中产生的数据也会随之销毁

2. Docker 容器和外部机器可以直接交换文件吗？ 

3. 容器之间想要进行数据交互？

![1592748818477](images\1592748818477.png)

**数据卷**

* 数据卷是宿主机中的一个目录或文件
* 当容器目录和数据卷目录绑定后，对方的修改会立即同步
* 一个数据卷可以被多个容器同时挂载
* 一个容器也可以被挂载多个数据卷

![1592748888266](images\1592748888266.png)

**数据卷的作用**

1. 容器数据持久化 

2. 外部机器和容器间接通信 

3. 容器之间数据交换 

### 3.2 配置数据卷

**创建启动容器时，使用 –v 参数 设置数据卷**

~~~shell
docker run ... –v 宿主机目录(文件):容器内目录(文件) ...
~~~

**注意事项：** 

1. 目录必须是绝对路径 

2. 如果目录不存在，会自动创建 

3. 一个容器可以挂载多个数据卷
4. 一个数据卷也可以被多个容器挂载
5. 两个容器可以挂载同一个容器

在宿主机中实现与容器目录的挂载：

在c1容器中的root目录下就可以看到data_container文件夹：如下图

![1592750980127](images\1592750980127.png)

同时我们我们回到宿主机中，可以在data文件夹下创建一个文件itcast.txt ,可以发现在容器中也会生成itcast.txt文件：如下图

![1592751613509](images\1592751613509.png)

1. 数据卷的持久化：

​	当我们把c1容器删除后，宿主机中的数据卷依然存在。  所以当我们重新创建一个容器的同时依然可以挂载宿主机中的data文件夹，对应data里的数据依然同步到容器中。

2. 一个容器可以挂载多个数据卷

![1592752027409](images\1592752027409.png)

3. 多个容器可以挂载同一个数据卷

![1592749838266](images\1592749838266.png)

分别创建两个容器，两个容器都挂载宿主机中data目录，当 修改c3容器的data目录c4会实现同步。

从而实现两个容器之间的交互。

### 3.3 配置数据卷容器

**多容器进行数据交换** 

1. 多个容器挂载同一个数据卷

2. 数据卷容器

![1592753247374](images\1592753247374.png)

**步骤：**

1.创建启动c3数据卷容器，使用 –v 参数 设置数据卷

~~~shell
docker run -it --name=c3 -v /volume centos:7 /bin/bash
~~~

2. 创建启动 c1 c2 容器，使用 –-volumes-from 参数 设置数据卷

~~~shell
docker run –it --name=c1 --volumes-from c3 centos:7 /bin/bash
docker run -it --name=c2 --volumes-from c3 centos:7 /bin/bash
~~~

3. 在c3中添加文件，c1和c2会自动同步过去

```shell
# c3
touch /volume/hello.txt
# c1 c2
cat /volume/hello.txt
```

### 3.4 数据卷小结

1. 数据卷概念

    宿主机的一个目录或文件

2. 数据卷作用
  
    * 容器数据持久化
    * 客户端和容器数据交换
* 容器间数据交换
  
3. 数据卷容器
  
    * 创建一个容器，挂载一个目录，让其他容器==继承==自该容器( --volume-from )

4. 通过简单方式实现数据卷配置

## 4. 应用部署

参考资料中[docker应用部署.md](./docker应用部署.md)

## 5.  Docerfile

前面的课程中已经知道了，要获得镜像，可以从Docker仓库中进行下载。

那如果我们想自己开发一个镜像，那该如何做呢？答案是：Dockerfifile 

Dockerfifile其实就是一个文本文件，由一系列命令和参数构成，Docker可以读取Dockerfifile文件并根据Dockerfifile文 件的描述来构建镜像。 

### 5.1 Docker镜像原理

思考：
1. Docker 镜像本质是什么？
 是一个分层文件系统

2. Docker 中一个centos镜像为什么只有200MB，而一个centos操作系统的iso文件要几个个G？ ?

     Centos的iso镜像文件包含bootfs和rootfs，而docker的centos镜像复用操作系统的bootfs，只有rootfs和其他镜像层

3. Docker 中一个tomcat镜像为什么有500MB，而一个tomcat安装包只有70多MB？ ? 

  由于docker中镜像是分层的，tomcat虽然只有70多MB，但他需要依赖于父镜像和基础镜像，所有整个对外暴露的
  tomcat镜像大小500多MB

![1592761590593](images\1592761590593.png)

![1592761605037](images\1592761605037.png)

### 5.2 镜像制作

1. 容器逆向生成镜像
2. dockerfile

#### 5.2.1 容器转为镜像

1. 使用docker commit命令可以将容器保存为镜像。

~~~shell
# 命令形式：docker commit 容器名称 镜像名称
docker commit 381827f60f70 itheima_tomcat:1.0
~~~

2. 使用docker save命令可以将已有镜像保存为tar 文件。

~~~shell
# 命令形式：docker save –o tar文件名 镜像名
docker save -o itheima_tomcat.tar itheima_tomcat:1.0
~~~

3. 使用docker load命令可以根据tar文件恢复为docker镜像。

~~~shell
# 命令形式：docker load -i tar文件名
# 加载恢复镜像
docker load -i itheima_tomcat.tar
# 在镜像恢复之后，基于该镜像再次创建启动容器 
docker run -di --name=new_tomcat -p 8080:8080 itheima_tomcat:1.0
~~~

**注意：新的镜像制作后，原本容器中挂载的目录将失效，  索引一般在恢复镜像创建容器容器的时候需要重新挂载。**

### 5.3 Dockerfile概念

* Dockerfile 是一个文本文件
* 包含了一条条的指令
* 每一条指令构建一层，基于基础镜像，最终构建出一个新的镜像
* 对于开发人员，可以为开发团队提供一个完全一致的开发环境
* 对于测试人员，可以直接拿开发时所构建的镜像或者通过Dockerfile文件
  构建一个新的镜像开始工作了
* 对于运维人员，在部署时，可以实现应用的无缝移植

Dochub网址：https://hub.docker.com



<img src="images\1592763188913.png" alt="1592763188913" style="zoom:50%;" />

**关键字：**

| 关键字      | 作用                     | 备注                                                         |
| ----------- | ------------------------ | ------------------------------------------------------------ |
| FROM        | 指定父镜像               | 指定dockerfile基于哪个image构建                              |
| MAINTAINER  | 作者信息                 | 用来标明这个dockerfile谁写的                                 |
| LABEL       | 标签                     | 用来标明dockerfile的标签 可以使用Label代替Maintainer 最终都是在docker image基本信息中可以查看 |
| RUN         | 执行命令                 | 执行一段命令 默认是/bin/sh 格式: RUN command 或者 RUN ["command" , "param1","param2"] |
| CMD         | 容器启动命令             | 提供启动容器时候的默认命令 和ENTRYPOINT配合使用.格式 CMD command param1 param2 或者 CMD ["command" , "param1","param2"] |
| ENTRYPOINT  | 入口                     | 一般在制作一些执行就关闭的容器中会使用                       |
| COPY        | 复制文件                 | build的时候复制文件到image中                                 |
| ADD         | 添加文件                 | build的时候添加文件到image中 不仅仅局限于当前build上下文 可以来源于远程服务 |
| ENV         | 环境变量                 | 指定build时候的环境变量 可以在启动的容器的时候 通过-e覆盖 格式ENV name=value |
| ARG         | 构建参数                 | 构建参数 只在构建的时候使用的参数 如果有ENV 那么ENV的相同名字的值始终覆盖arg的参数 |
| VOLUME      | 定义外部可以挂载的数据卷 | 指定build的image那些目录可以启动的时候挂载到文件系统中 启动容器的时候使用 -v 绑定 格式 VOLUME ["目录"] |
| EXPOSE      | 暴露端口                 | 定义容器运行的时候监听的端口 启动容器的使用-p来绑定暴露端口 格式: EXPOSE 8080 或者 EXPOSE 8080/udp |
| WORKDIR     | 工作目录                 | 指定容器内部的工作目录 如果没有创建则自动创建 如果指定/ 使用的是绝对地址 如果不是/开头那么是在上一条workdir的路径的相对路径 |
| USER        | 指定执行用户             | 指定build或者启动的时候 用户 在RUN CMD ENTRYPONT执行的时候的用户 |
| HEALTHCHECK | 健康检查                 | 指定监测当前容器的健康监测的命令 基本上没用 因为很多时候 应用本身有健康监测机制 |
| ONBUILD     | 触发器                   | 当存在ONBUILD关键字的镜像作为基础镜像的时候 当执行FROM完成之后 会执行 ONBUILD的命令 但是不影响当前镜像 用处也不怎么大 |
| STOPSIGNAL  | 发送信号量到宿主机       | 该STOPSIGNAL指令设置将发送到容器的系统调用信号以退出。       |
| SHELL       | 指定执行脚本的shell      | 指定RUN CMD ENTRYPOINT 执行命令的时候 使用的shell            |

### 5.4 Dockerfile案例

#### 案例一

自定义centos7镜像。要求：

1. 默认登录路径为 /usr
2. 可以使用vim

**实现步骤**：

① 定义父镜像：FROM centos:7

② 定义作者信息：MAINTAINER itheima <itheima@itcast.cn>

③ 执行安装vim命令： RUN yum install -y vim

④ 定义默认的工作目录：WORKDIR /usr

⑤ 定义容器启动执行的命令：CMD /bin/bash

⑥ 通过dockerfile构建镜像：docker bulid –f dockerfile文件路径 –t 镜像名称:版本

**Dockerfile文件：**

![1592764213253](images\1592764213253.png)

文件编写完成执行命令构建：

~~~shell
docker build -f ./centos_dockerfile -t itheima_centos:1 .
~~~

查看创建的自定义镜像

```shell
docker images
```

#### 案例二

定义dockerfile，发布springboot项目

**实现步骤** 

​     ① 定义父镜像：FROM java:8 

​     ② 定义作者信息：MAINTAINER itheima <itheima@itcast.cn> 

​     ③ 将jar包添加到容器： ADD springboot.jar app.jar 

​     ④ 定义容器启动执行的命令：CMD java –jar app.jar 

​     ⑤ 通过dockerfile构建镜像：docker bulid –f dockerfile文件路径 –t 镜像名称:版本

![1592765120052](images\1592765120052.png)

文件编写完成执行命令构建：

~~~shell
docker build -f ./springboot_dockerfile -t app .
~~~

创建并启动容器

```
docker run -id -p 9000:9000 app
```

查看日志信息

```shell
# docker logs 容器id
docker logs 0603400c617796acf3571f9d04eaa7f4519683003cbc714b0b8dd19dbf151ec7
```

## 6.  服务编排

### 6.1 基本概念

微服务架构的应用系统中一般包含若干个微服务，每个微服务一般都会部署多个实例，如果每个微服务都要手动启停，维护的工作量会很大。

* 要从Dockerfile build image 或者去dockerhub拉取image
* 要创建多个container
*  要管理这些container（启动停止删除）
*  服务编排： 按照一定的业务规则批量管理容器

### 6.2 概述

#### 6.2.1 Docker Compose

Docker Compose是一个编排多容器分布式部署的工具，提供命令集管理容器化应用的完整开发周期，包括服务构建 ，启动和停止。使用步骤： 

1. 利用 Dockerfile 定义运行环境镜像 

2. 使用 docker-compose.yml 定义组成应用的各服务 

3. 运行 docker-compose up 启动应用

![1592767533518](images\1592767533518.png)

#### 6.2.2  Docker Compose 安装使用

参考[docker-compose.md](./docker-compose.md)

## 7. Docker 私有仓库

Docker官方的Docker hub（https://hub.docker.com）是一个用于管理公共镜像的仓库，我们可以从上面拉取镜像 到本地，也可以把我们自己的镜像推送上去。但是，有时候我们的服务器无法访问互联网，或者你不希望将自己的镜 像放到公网当中，那么我们就需要搭建自己的私有仓库来存储和管理自己的镜像。

搭建参考《docker 私有仓库.md》

## 8. 容器与虚拟机

![1592770300637](images\1592770300637.png)



![1592770331752](images\1592770331752.png)


