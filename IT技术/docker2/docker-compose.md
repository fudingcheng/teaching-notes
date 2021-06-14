## Docker Compose

### 一、安装Docker Compose

```shell
# Compose目前已经完全支持Linux、Mac OS和Windows，在我们安装Compose之前，需要先安装Docker。下面我们以编译好的二进制包方式安装在Linux系统中。 
curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

# 下载速度慢更换源即可
curl -L https://get.daocloud.io/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

# 设置文件可执行权限 
chmod +x /usr/local/bin/docker-compose
# 查看版本信息 
docker-compose -version
```

### 二、卸载Docker Compose

```shell
# 二进制包方式安装的，删除二进制文件即可
rm /usr/local/bin/docker-compose
```

### 三、 使用docker compose编排nginx+springboot项目

1. 创建docker-compose目录

```shell
mkdir ~/docker-compose
cd ~/docker-compose
```

2. 编写 docker-compose.yml 文件

```shell
version: '3'  # 版本是3
services:
  nginx:	# 第一个应用nginx
   image: nginx	 # 来自nginx镜像
   ports:	# 映射端口
    - 80:80
   links:	
    - app	# 关联app应用
   volumes:
    - ./nginx/conf.d:/etc/nginx/conf.d		# 目录映射
  app:	
    image: app  # 第二个镜像，来自于自定义的app应用
    expose:
      - "8080"  # 对外暴露8080端口
```

3. 创建./nginx/conf.d目录，配置nginx代理信息

```shell
mkdir -p ./nginx/conf.d
```

4. 在./nginx/conf.d目录下 编写itheima.conf文件

```shell
server {
    listen 80;
    access_log off;

    location / {
        proxy_pass http://app:8080;	# 访问nginx，讲请求转发到app容器的8080端口上
    }
}
```

5. 在~/docker-compose 目录下 使用docker-compose 启动容器

```shell
docker-compose up
```

6. 测试访问

```shell
http://192.168.149.135/hello
```

