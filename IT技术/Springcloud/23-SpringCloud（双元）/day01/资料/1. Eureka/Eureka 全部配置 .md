# Euraka配置详解

Eureka包含四个部分的配置

1. instance：当前Eureka Instance实例信息配置
2. client：Eureka Client客户端特性配置
3. server：Eureka Server注册中心特性配置
4. dashboard：Eureka Server注册中心仪表盘配置

## Eureka Instance实例信息配置

Eureka Instance的配置信息全部保存在org.springframework.cloud.netflix.eureka.EurekaInstanceConfigBean配置类里，实际上它是com.netflix.appinfo.EurekaInstanceConfig的实现类，替代了netflix的com.netflix.appinfo.CloudInstanceConfig的默认实现。

Eureka Instance的配置信息全部以eureka.instance.xxx的格式配置。

**配置列表**

- appname = unknown

应用名，首先获取spring.application.name的值，如果取值为空，则取默认unknown。

- appGroupName = null

应用组名

- instanceEnabledOnit = false

实例注册到Eureka上是，是否立刻开启通讯。有时候应用在准备好服务之前需要一些预处理。

- nonSecurePort = 80

非安全的端口

- securePort = 443

安全端口

- nonSecurePortEnabled = true

是否开启非安全端口通讯

- securePortEnabled = false

是否开启安全端口通讯

- leaseRenewalIntervalInSeconds = 30

实例续约间隔时间

- leaseExpirationDurationInSeconds = 90

实例超时时间，表示最大leaseExpirationDurationInSeconds秒后没有续约，Server就认为他不可用了，随之就会将其剔除。

- virtualHostName = unknown

虚拟主机名，首先获取spring.application.name的值，如果取值为空，则取默认unknown。

- instanceId

注册到eureka上的唯一实例ID，不能与相同appname的其他实例重复。

- secureVirtualHostName = unknown

安全虚拟主机名，首先获取spring.application.name的值，如果取值为空，则取默认unknown。

- metadataMap = new HashMap();

实例元数据，可以供其他实例使用。比如spring-boot-admin在监控时，获取实例的上下文和端口。

- dataCenterInfo = new MyDataCenterInfo(DataCenterInfo.Name.MyOwn);

实例部署的数据中心。如AWS、MyOwn。

- ipAddress=null

实例的IP地址

- statusPageUrlPath = "/actuator/info"

实例状态页相对url

- statusPageUrl = null

实例状态页绝对URL

- homePageUrlPath = "/"

实例主页相对URL

- homePageUrl = null

实例主页绝对URL

- healthCheckUrlUrlPath = "/actuator/health"

实例健康检查相对URL

- healthCheckUrl = null

实例健康检查绝对URL

- secureHealthCheckUrl = null

实例安全的健康检查绝对URL

- namespace = "eureka"

配置属性的命名空间（Spring Cloud中被忽略）

- hostname = null

主机名,不配置的时候讲根据操作系统的主机名来获取

- preferIpAddress = false

是否优先使用IP地址作为主机名的标识

## Eureka Client客户端特性配置

Eureka Client客户端特性配置是对作为Eureka客户端的特性配置，包括Eureka注册中心，本身也是一个Eureka Client。

Eureka Client特性配置全部在org.springframework.cloud.netflix.eureka.EurekaClientConfigBean中，实际上它是com.netflix.discovery.EurekaClientConfig的实现类，替代了netxflix的默认实现。

Eureka Client客户端特性配置全部以eureka.client.xxx的格式配置。

**配置列表**

- enabled=true

是否启用Eureka client。

- registryFetchIntervalSeconds=30

定时从Eureka Server拉取服务注册信息的间隔时间

- instanceInfoReplicationIntervalSeconds=30

定时将实例信息（如果变化了）复制到Eureka Server的间隔时间。（InstanceInfoReplicator线程）

- initialInstanceInfoReplicationIntervalSeconds=40

首次将实例信息复制到Eureka Server的延迟时间。（InstanceInfoReplicator线程）

- eurekaServiceUrlPollIntervalSeconds=300

拉取Eureka Server地址的间隔时间（Eureka Server有可能增减）

- proxyPort=null

Eureka Server的代理端口

- proxyHost=null

Eureka Server的代理主机名

- proxyUserName=null

Eureka Server的代理用户名

- proxyPassword=null

Eureka Server的代理密码

- eurekaServerReadTimeoutSeconds=8

从Eureka Server读取信息的超时时间

- eurekaServerConnectTimeoutSeconds=5

连接Eureka Server的超时时间

- backupRegistryImpl=null

Eureka Client第一次启动时获取服务注册信息的调用的回溯实现。Eureka Client启动时首次会检查有没有BackupRegistry的实现类，如果有实现类，则优先从这个实现类里获取服务注册信息。

- eurekaServerTotalConnections=200

Eureka client连接Eureka Server的链接总数

- eurekaServerTotalConnectionsPerHost=50

Eureka client连接单台Eureka Server的链接总数

- eurekaServerURLContext=null

当Eureka server的列表在DNS中时，Eureka Server的上下文路径。如http://xxxx/eureka。

- eurekaServerPort=null

当Eureka server的列表在DNS中时，Eureka Server的端口。

- eurekaServerDNSName=null

当Eureka server的列表在DNS中时，且要通过DNSName获取Eureka Server列表时，DNS名字。

- region="us-east-1"

实例所属区域。

- eurekaConnectionIdleTimeoutSeconds = 30

Eureka Client和Eureka Server之间的Http连接的空闲超时时间。

- heartbeatExecutorThreadPoolSize=2

心跳（续约）执行器线程池大小。

- heartbeatExecutorExponentialBackOffBound=10

心跳执行器在续约过程中超时后的再次执行续约的最大延迟倍数。默认最大延迟时间=10 * eureka.instance.leaseRenewalIntervalInSeconds

- cacheRefreshExecutorThreadPoolSize=2

cacheRefreshExecutord的线程池大小（获取注册信息）

- cacheRefreshExecutorExponentialBackOffBound=10

cacheRefreshExecutord的再次执行的最大延迟倍数。默认最大延迟时间=10 *eureka.client.registryFetchIntervalSeconds

- serviceUrl= new HashMap();serviceUrl.put(DEFAULT_ZONE, DEFAULT_URL);

Eureka Server的分区地址。默认添加了一个defualtZone。也就是最常用的配置eureka.client.service-url.defaultZone=xxx

- registerWithEureka=true

是否注册到Eureka Server。

- preferSameZoneEureka=true

是否使用相同Zone下的Eureka server。

- logDeltaDiff=false

是否记录Eureka Server和Eureka Client之间注册信息的差异

- disableDelta=false

是否开启增量同步注册信息。

- fetchRemoteRegionsRegistry=null

获取注册服务的远程地区，以逗号隔开。

- availabilityZones=new HashMap()

可用分区列表。用逗号隔开。

- filterOnlyUpInstances = true

是否只拉取UP状态的实例。

- fetchRegistry=true

是否拉取注册信息。

- shouldUnregisterOnShutdown = true

是否在停止服务的时候向Eureka Server发起Cancel指令。

- shouldEnforceRegistrationAtInit = false

是否在初始化过程中注册服务。

## Eureka Server注册中心端配置

Eureka Server注册中心端的配置是对注册中心的特性配置。Eureka Server的配置全部在org.springframework.cloud.netflix.eureka.server.EurekaServerConfigBean里，实际上它是com.netflix.eureka.EurekaServerConfig的实现类，替代了netflix的默认实现。

Eureka Server的配置全部以eureka.server.xxx的格式进行配置。

**配置列表**

- enableSelfPreservation=true

是否开启自我保护

- renewalPercentThreshold = 0.85

自我保护续约百分比阀值因子。如果实际续约数小于续约数阀值，则开启自我保护

- renewalThresholdUpdateIntervalMs = 15 * 60 * 1000

续约数阀值更新频率。

- peerEurekaNodesUpdateIntervalMs = 10 * 60 * 1000

Eureka Server节点更新频率。

- enableReplicatedRequestCompression = false

是否启用复制请求压缩。

- waitTimeInMsWhenSyncEmpty=5 * 60 * 1000

当从其他节点同步实例信息为空时等待的时间。

- peerNodeConnectTimeoutMs=200

节点间连接的超时时间。

- peerNodeReadTimeoutMs=200

节点间读取信息的超时时间。

- peerNodeTotalConnections=1000

节点间连接总数。

- peerNodeTotalConnectionsPerHost = 500;

单个节点间连接总数。

- peerNodeConnectionIdleTimeoutSeconds = 30;

节点间连接空闲超时时间。

- retentionTimeInMSInDeltaQueue = 3 * MINUTES;

增量队列的缓存时间。

- deltaRetentionTimerIntervalInMs = 30 * 1000;

清理增量队列中过期的频率。

- evictionIntervalTimerInMs = 60 * 1000;

剔除任务频率。

- responseCacheAutoExpirationInSeconds = 180;

注册列表缓存超时时间（当注册列表没有变化时）

- responseCacheUpdateIntervalMs = 30 * 1000;

注册列表缓存更新频率。

- useReadOnlyResponseCache = true;

是否开启注册列表的二级缓存。

- disableDelta=false。

是否为client提供增量信息。

- maxThreadsForStatusReplication = 1;

状态同步的最大线程数。

- maxElementsInStatusReplicationPool = 10000;

状态同步队列的最大容量。

- syncWhenTimestampDiffers = true;

当时间差异时是否同步。

- registrySyncRetries = 0;

注册信息同步重试次数。

- registrySyncRetryWaitMs = 30 * 1000;

注册信息同步重试期间的时间间隔。

- maxElementsInPeerReplicationPool = 10000;

节点间同步事件的最大容量。

- minThreadsForPeerReplication = 5;

节点间同步的最小线程数。

- maxThreadsForPeerReplication = 20;

节点间同步的最大线程数。

- maxTimeForReplication = 30000;

节点间同步的最大时间，单位为毫秒。

- disableDeltaForRemoteRegions = false；

是否启用远程区域增量。

- remoteRegionConnectTimeoutMs = 1000;

远程区域连接超时时间。

- remoteRegionReadTimeoutMs = 1000;

远程区域读取超时时间。

- remoteRegionTotalConnections = 1000;

远程区域最大连接数

- remoteRegionTotalConnectionsPerHost = 500;

远程区域单机连接数

- remoteRegionConnectionIdleTimeoutSeconds = 30;

远程区域连接空闲超时时间。

- remoteRegionRegistryFetchInterval = 30;

远程区域注册信息拉取频率。

- remoteRegionFetchThreadPoolSize = 20;

远程区域注册信息线程数。

## **Eureka Server注册中心仪表盘配置**

注册中心仪表盘的配置主要是控制注册中心的可视化展示。以eureka.dashboard.xxx的格式配置。

- path="/"

仪表盘访问路径

- enabled=true

是否启用仪表盘