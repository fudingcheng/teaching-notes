# JDBC高级

## 1. 数据库连接池

### 1.1 连接池的概念

- 数据库连接背景
  - 数据库连接是一种关键的、有限的、昂贵的资源，这一点在多用户的网页应用程序中体现得尤为突出。对数据库连接的管理能显著影响到整个应用程序的伸缩性和健壮性，影响到程序的性能指标。数据库连接池正是针对这个问题提出来的。
- 数据库连接池
  - 数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是再重新建立一个。这项技术能明显提高对数据库操作的性能。
- 数据库连接池原理

![01](JDBC-02-授课笔记.assets/01.png)

### 1.2 自定义连接池

- java.sql.DataSource接口：数据源(数据库连接池)。java官方提供的数据库连接池规范(接口)
  - 获取数据库连接对象：Connection getConnection();
- 自定义连接池

```java
/*
	自定义连接池类
*/
public class MyDataSource implements DataSource{
    //定义集合容器，用于保存多个数据库连接对象
    private static List<Connection> pool = Collections.synchronizedList(new ArrayList<Connection>());

    //静态代码块，生成10个数据库连接保存到集合中
    static {
        for (int i = 0; i < 10; i++) {
            Connection con = JDBCUtils.getConnection();
            pool.add(con);
        }
    }

    //返回连接池的大小
    public int getSize() {
        return pool.size();
    }

    //从池中返回一个数据库连接
    @Override
    public Connection getConnection() {
        if(pool.size() > 0) {
            //从池中获取数据库连接
            return pool.remove(0);
        }else {
            throw new RuntimeException("连接数量已用尽");
        }
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return null;
    }

    @Override
    public <T> T unwrap(Class<T> iface) throws SQLException {
        return null;
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        return false;
    }

    @Override
    public PrintWriter getLogWriter() throws SQLException {
        return null;
    }

    @Override
    public void setLogWriter(PrintWriter out) throws SQLException {

    }

    @Override
    public void setLoginTimeout(int seconds) throws SQLException {

    }

    @Override
    public int getLoginTimeout() throws SQLException {
        return 0;
    }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        return null;
    }
}
```

### 1.3 测试连接池

```java
public class MyDataSourceTest {
    public static void main(String[] args) throws Exception{
        //创建数据库连接池对象
        MyDataSource dataSource = new MyDataSource();

        System.out.println("使用之前连接池数量：" + dataSource.getSize());
        
        //获取数据库连接对象
        Connection con = dataSource.getConnection();
        System.out.println(con.getClass());// JDBC4Connection

        //查询学生表全部信息
        String sql = "SELECT * FROM student";
        PreparedStatement pst = con.prepareStatement(sql);
        ResultSet rs = pst.executeQuery();

        while(rs.next()) {
            System.out.println(rs.getInt("sid") + "\t" + rs.getString("name") + "\t" + rs.getInt("age") + "\t" + rs.getDate("birthday"));
        }
        
        //释放资源
        rs.close();
        pst.close();
		//目前的连接对象close方法，是直接关闭连接，而不是将连接归还池中
        con.close();

        System.out.println("使用之后连接池数量：" + dataSource.getSize());
    }
}
```

### 1.4 归还连接

#### 1）继承

- 通过打印连接对象，发现DriverManager获取的连接实现类是JDBC4Connection。
- 自定义一个类，继承JDBC4Connection这个类，重写close()方法。

```java
/*
    自定义Connection类
 */
public class MyConnection1 extends JDBC4Connection {
    //声明连接对象和连接池集合对象
    private Connection con;
    private List<Connection> pool;

    //通过构造方法给成员变量赋值
    public MyConnection1(String hostToConnectTo, int portToConnectTo, Properties info, String databaseToConnectTo, String url,Connection con,List<Connection> pool) throws SQLException {
        super(hostToConnectTo, portToConnectTo, info, databaseToConnectTo, url);
        this.con = con;
        this.pool = pool;
    }

    //重写close()方法，将连接归还给池中
    @Override
    public void close() throws SQLException {
        pool.add(con);
    }
}
```

- 但是这种方式行不通，通过查看JDBC工具类获取连接的方法我们发现：我们虽然自定义了一个子类，完成了归还连接的操作。但是DriverManager获取的还是JDBC4Connection这个对象，并不是我们的子类对象。而我们又不能整体去修改驱动包中类的功能！

```java
//将之前的连接对象换成自定义的子类对象
private static MyConnection1 con;

//4.获取数据库连接的方法
public static Connection getConnection() {
    try {
        //等效于：MyConnection1 con = new JDBC4Connection();  语法错误！
        con = DriverManager.getConnection(url,username,password);
    } catch (SQLException e) {
        e.printStackTrace();
    }

    return con;
}
```

#### 2）装饰者设计模式

- 自定义连接类

```java
/*
    自定义Connection类。通过装饰设计模式，实现和mysql驱动包中的Connection实现类相同的功能！
    实现步骤：
        1.定义一个类，实现Connection接口
        2.定义Connection连接对象和连接池容器对象的变量
        3.提供有参构造方法，接收连接对象和连接池对象，对变量赋值
        4.在close()方法中，完成连接的归还
        5.剩余方法，只需要调用mysql驱动包的连接对象完成即可
 */
public class MyConnection2 implements Connection {

    //2.定义Connection连接对象和连接池容器对象的变量
    private Connection con;
    private List<Connection> pool;

    //3.提供有参构造方法，接收连接对象和连接池对象，对变量赋值
    public MyConnection2(Connection con,List<Connection> pool) {
        this.con = con;
        this.pool = pool;
    }

    //4.在close()方法中，完成连接的归还
    @Override
    public void close() throws SQLException {
        pool.add(con);
    }


    @Override
    public Statement createStatement() throws SQLException {
        return con.createStatement();
    }

    @Override
    public PreparedStatement prepareStatement(String sql) throws SQLException {
        return con.prepareStatement(sql);
    }

    @Override
    public CallableStatement prepareCall(String sql) throws SQLException {
        return con.prepareCall(sql);
    }

    @Override
    public String nativeSQL(String sql) throws SQLException {
        return con.nativeSQL(sql);
    }

    @Override
    public void setAutoCommit(boolean autoCommit) throws SQLException {
        con.setAutoCommit(autoCommit);
    }

    @Override
    public boolean getAutoCommit() throws SQLException {
        return con.getAutoCommit();
    }

    @Override
    public void commit() throws SQLException {
        con.commit();
    }

    @Override
    public void rollback() throws SQLException {
        con.rollback();
    }

    @Override
    public boolean isClosed() throws SQLException {
        return con.isClosed();
    }

    @Override
    public DatabaseMetaData getMetaData() throws SQLException {
        return con.getMetaData();
    }

    @Override
    public void setReadOnly(boolean readOnly) throws SQLException {
        con.setReadOnly(readOnly);
    }

    @Override
    public boolean isReadOnly() throws SQLException {
        return con.isReadOnly();
    }

    @Override
    public void setCatalog(String catalog) throws SQLException {
        con.setCatalog(catalog);
    }

    @Override
    public String getCatalog() throws SQLException {
        return con.getCatalog();
    }

    @Override
    public void setTransactionIsolation(int level) throws SQLException {
        con.setTransactionIsolation(level);
    }

    @Override
    public int getTransactionIsolation() throws SQLException {
        return con.getTransactionIsolation();
    }

    @Override
    public SQLWarning getWarnings() throws SQLException {
        return con.getWarnings();
    }

    @Override
    public void clearWarnings() throws SQLException {
        con.clearWarnings();
    }

    @Override
    public Statement createStatement(int resultSetType, int resultSetConcurrency) throws SQLException {
        return con.createStatement(resultSetType,resultSetConcurrency);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency) throws SQLException {
        return con.prepareStatement(sql,resultSetType,resultSetConcurrency);
    }

    @Override
    public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency) throws SQLException {
        return con.prepareCall(sql,resultSetType,resultSetConcurrency);
    }

    @Override
    public Map<String, Class<?>> getTypeMap() throws SQLException {
        return con.getTypeMap();
    }

    @Override
    public void setTypeMap(Map<String, Class<?>> map) throws SQLException {
        con.setTypeMap(map);
    }

    @Override
    public void setHoldability(int holdability) throws SQLException {
        con.setHoldability(holdability);
    }

    @Override
    public int getHoldability() throws SQLException {
        return con.getHoldability();
    }

    @Override
    public Savepoint setSavepoint() throws SQLException {
        return con.setSavepoint();
    }

    @Override
    public Savepoint setSavepoint(String name) throws SQLException {
        return con.setSavepoint(name);
    }

    @Override
    public void rollback(Savepoint savepoint) throws SQLException {
        con.rollback(savepoint);
    }

    @Override
    public void releaseSavepoint(Savepoint savepoint) throws SQLException {
        con.releaseSavepoint(savepoint);
    }

    @Override
    public Statement createStatement(int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
        return con.createStatement(resultSetType,resultSetConcurrency,resultSetHoldability);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
        return con.prepareStatement(sql,resultSetType,resultSetConcurrency,resultSetHoldability);
    }

    @Override
    public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
        return con.prepareCall(sql,resultSetType,resultSetConcurrency,resultSetHoldability);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int autoGeneratedKeys) throws SQLException {
        return con.prepareStatement(sql,autoGeneratedKeys);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int[] columnIndexes) throws SQLException {
        return con.prepareStatement(sql,columnIndexes);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, String[] columnNames) throws SQLException {
        return con.prepareStatement(sql,columnNames);
    }

    @Override
    public Clob createClob() throws SQLException {
        return con.createClob();
    }

    @Override
    public Blob createBlob() throws SQLException {
        return con.createBlob();
    }

    @Override
    public NClob createNClob() throws SQLException {
        return con.createNClob();
    }

    @Override
    public SQLXML createSQLXML() throws SQLException {
        return con.createSQLXML();
    }

    @Override
    public boolean isValid(int timeout) throws SQLException {
        return con.isValid(timeout);
    }

    @Override
    public void setClientInfo(String name, String value) throws SQLClientInfoException {
        con.setClientInfo(name,value);
    }

    @Override
    public void setClientInfo(Properties properties) throws SQLClientInfoException {
        con.setClientInfo(properties);
    }

    @Override
    public String getClientInfo(String name) throws SQLException {
        return con.getClientInfo(name);
    }

    @Override
    public Properties getClientInfo() throws SQLException {
        return con.getClientInfo();
    }

    @Override
    public Array createArrayOf(String typeName, Object[] elements) throws SQLException {
        return con.createArrayOf(typeName,elements);
    }

    @Override
    public Struct createStruct(String typeName, Object[] attributes) throws SQLException {
        return con.createStruct(typeName,attributes);
    }

    @Override
    public void setSchema(String schema) throws SQLException {
        con.setSchema(schema);
    }

    @Override
    public String getSchema() throws SQLException {
        return con.getSchema();
    }

    @Override
    public void abort(Executor executor) throws SQLException {
        con.abort(executor);
    }

    @Override
    public void setNetworkTimeout(Executor executor, int milliseconds) throws SQLException {
        con.setNetworkTimeout(executor,milliseconds);
    }

    @Override
    public int getNetworkTimeout() throws SQLException {
        return con.getNetworkTimeout();
    }

    @Override
    public <T> T unwrap(Class<T> iface) throws SQLException {
        return con.unwrap(iface);
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        return con.isWrapperFor(iface);
    }
}
```

- 自定义连接池类

```java
public class MyDataSource implements DataSource{
    //定义集合容器，用于保存多个数据库连接对象
    private static List<Connection> pool = Collections.synchronizedList(new ArrayList<Connection>());

    //静态代码块，生成10个数据库连接保存到集合中
    static {
        for (int i = 0; i < 10; i++) {
            Connection con = JDBCUtils.getConnection();
            pool.add(con);
        }
    }

    //返回连接池的大小
    public int getSize() {
        return pool.size();
    }

    //从池中返回一个数据库连接
    @Override
    public Connection getConnection() {
        if(pool.size() > 0) {
            //从池中获取数据库连接
            Connection con = pool.remove(0);
            //通过自定义连接对象进行包装
            MyConnection2 mycon = new MyConnection2(con,pool);
            //返回包装后的连接对象
            return mycon;
        }else {
            throw new RuntimeException("连接数量已用尽");
        }
    }
}
```

#### 3）适配器设计模式

- 通过之前MyConnection2连接类我们发现，有很多个需要实现的方法。这个时候我们就可以使用适配器设计模式了。提供一个适配器类，实现Connection接口，将所有功能进行实现(除了close方法)。自定义连接类只需要继承这个适配器类，重写需要改进的close()方法即可！
- 适配器类

```java
/*
    适配器抽象类。实现Connection接口。
    实现所有的方法，调用mysql驱动包中Connection连接对象的方法
 */
public abstract class MyAdapter implements Connection {

    // 定义数据库连接对象的变量
    private Connection con;

    // 通过构造方法赋值
    public MyAdapter(Connection con) {
        this.con = con;
    }

    // 所有的方法，均调用mysql的连接对象实现
    @Override
    public Statement createStatement() throws SQLException {
        return con.createStatement();
    }

    @Override
    public PreparedStatement prepareStatement(String sql) throws SQLException {
        return con.prepareStatement(sql);
    }

    @Override
    public CallableStatement prepareCall(String sql) throws SQLException {
        return con.prepareCall(sql);
    }

    @Override
    public String nativeSQL(String sql) throws SQLException {
        return con.nativeSQL(sql);
    }

    @Override
    public void setAutoCommit(boolean autoCommit) throws SQLException {
        con.setAutoCommit(autoCommit);
    }

    @Override
    public boolean getAutoCommit() throws SQLException {
        return con.getAutoCommit();
    }

    @Override
    public void commit() throws SQLException {
        con.commit();
    }

    @Override
    public void rollback() throws SQLException {
        con.rollback();
    }

    @Override
    public boolean isClosed() throws SQLException {
        return con.isClosed();
    }

    @Override
    public DatabaseMetaData getMetaData() throws SQLException {
        return con.getMetaData();
    }

    @Override
    public void setReadOnly(boolean readOnly) throws SQLException {
        con.setReadOnly(readOnly);
    }

    @Override
    public boolean isReadOnly() throws SQLException {
        return con.isReadOnly();
    }

    @Override
    public void setCatalog(String catalog) throws SQLException {
        con.setCatalog(catalog);
    }

    @Override
    public String getCatalog() throws SQLException {
        return con.getCatalog();
    }

    @Override
    public void setTransactionIsolation(int level) throws SQLException {
        con.setTransactionIsolation(level);
    }

    @Override
    public int getTransactionIsolation() throws SQLException {
        return con.getTransactionIsolation();
    }

    @Override
    public SQLWarning getWarnings() throws SQLException {
        return con.getWarnings();
    }

    @Override
    public void clearWarnings() throws SQLException {
        con.clearWarnings();
    }

    @Override
    public Statement createStatement(int resultSetType, int resultSetConcurrency) throws SQLException {
        return con.createStatement(resultSetType,resultSetConcurrency);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency) throws SQLException {
        return con.prepareStatement(sql,resultSetType,resultSetConcurrency);
    }

    @Override
    public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency) throws SQLException {
        return con.prepareCall(sql,resultSetType,resultSetConcurrency);
    }

    @Override
    public Map<String, Class<?>> getTypeMap() throws SQLException {
        return con.getTypeMap();
    }

    @Override
    public void setTypeMap(Map<String, Class<?>> map) throws SQLException {
        con.setTypeMap(map);
    }

    @Override
    public void setHoldability(int holdability) throws SQLException {
        con.setHoldability(holdability);
    }

    @Override
    public int getHoldability() throws SQLException {
        return con.getHoldability();
    }

    @Override
    public Savepoint setSavepoint() throws SQLException {
        return con.setSavepoint();
    }

    @Override
    public Savepoint setSavepoint(String name) throws SQLException {
        return con.setSavepoint(name);
    }

    @Override
    public void rollback(Savepoint savepoint) throws SQLException {
        con.rollback(savepoint);
    }

    @Override
    public void releaseSavepoint(Savepoint savepoint) throws SQLException {
        con.releaseSavepoint(savepoint);
    }

    @Override
    public Statement createStatement(int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
        return con.createStatement(resultSetType,resultSetConcurrency,resultSetHoldability);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
        return con.prepareStatement(sql,resultSetType,resultSetConcurrency,resultSetHoldability);
    }

    @Override
    public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException {
        return con.prepareCall(sql,resultSetType,resultSetConcurrency,resultSetHoldability);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int autoGeneratedKeys) throws SQLException {
        return con.prepareStatement(sql,autoGeneratedKeys);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, int[] columnIndexes) throws SQLException {
        return con.prepareStatement(sql,columnIndexes);
    }

    @Override
    public PreparedStatement prepareStatement(String sql, String[] columnNames) throws SQLException {
        return con.prepareStatement(sql,columnNames);
    }

    @Override
    public Clob createClob() throws SQLException {
        return con.createClob();
    }

    @Override
    public Blob createBlob() throws SQLException {
        return con.createBlob();
    }

    @Override
    public NClob createNClob() throws SQLException {
        return con.createNClob();
    }

    @Override
    public SQLXML createSQLXML() throws SQLException {
        return con.createSQLXML();
    }

    @Override
    public boolean isValid(int timeout) throws SQLException {
        return con.isValid(timeout);
    }

    @Override
    public void setClientInfo(String name, String value) throws SQLClientInfoException {
        con.setClientInfo(name,value);
    }

    @Override
    public void setClientInfo(Properties properties) throws SQLClientInfoException {
        con.setClientInfo(properties);
    }

    @Override
    public String getClientInfo(String name) throws SQLException {
        return con.getClientInfo(name);
    }

    @Override
    public Properties getClientInfo() throws SQLException {
        return con.getClientInfo();
    }

    @Override
    public Array createArrayOf(String typeName, Object[] elements) throws SQLException {
        return con.createArrayOf(typeName,elements);
    }

    @Override
    public Struct createStruct(String typeName, Object[] attributes) throws SQLException {
        return con.createStruct(typeName,attributes);
    }

    @Override
    public void setSchema(String schema) throws SQLException {
        con.setSchema(schema);
    }

    @Override
    public String getSchema() throws SQLException {
        return con.getSchema();
    }

    @Override
    public void abort(Executor executor) throws SQLException {
        con.abort(executor);
    }

    @Override
    public void setNetworkTimeout(Executor executor, int milliseconds) throws SQLException {
        con.setNetworkTimeout(executor,milliseconds);
    }

    @Override
    public int getNetworkTimeout() throws SQLException {
        return con.getNetworkTimeout();
    }

    @Override
    public <T> T unwrap(Class<T> iface) throws SQLException {
        return con.unwrap(iface);
    }

    @Override
    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        return con.isWrapperFor(iface);
    }
}
```

- 自定义连接类

```java
/*
    自定义Connection连接类。通过适配器设计模式。完成close()方法的重写
        1.定义一个类，继承适配器父类
        2.定义Connection连接对象和连接池容器对象的变量
        3.提供有参构造方法，接收连接对象和连接池对象，对变量赋值
        4.在close()方法中，完成连接的归还
 */
public class MyConnection3 extends MyAdapter {
    //2.定义Connection连接对象和连接池容器对象的变量
    private Connection con;
    private List<Connection> pool;

    //3.提供有参构造方法，接收连接对象和连接池对象，对变量赋值
    public MyConnection3(Connection con,List<Connection> pool) {
        super(con);    // 将接收的数据库连接对象给适配器父类传递
        this.con = con;
        this.pool = pool;
    }

    //4.在close()方法中，完成连接的归还
    @Override
    public void close() throws SQLException {
        pool.add(con);
    }
}
```

- 自定义连接池类

```java
public class MyDataSource implements DataSource{
    //定义集合容器，用于保存多个数据库连接对象
    private static List<Connection> pool = Collections.synchronizedList(new ArrayList<Connection>());

    //静态代码块，生成10个数据库连接保存到集合中
    static {
        for (int i = 0; i < 10; i++) {
            Connection con = JDBCUtils.getConnection();
            pool.add(con);
        }
    }

    //返回连接池的大小
    public int getSize() {
        return pool.size();
    }

    //从池中返回一个数据库连接
    @Override
    public Connection getConnection() {
        if(pool.size() > 0) {
            //从池中获取数据库连接
            Connection con = pool.remove(0);

            //通过自定义连接对象进行包装
            //MyConnection2 mycon = new MyConnection2(con,pool);
            MyConnection3 mycon = new MyConnection3(con,pool);

            //返回包装后的连接对象
            return mycon;
        }else {
            throw new RuntimeException("连接数量已用尽");
        }
    }
}

```

#### 4）动态代理

- 经过我们适配器模式的改进，自定义连接类中的方法已经很简洁了。剩余所有的方法已经抽取到了适配器类中。但是适配器这个类还是我们自己编写的，也比较麻烦！所以可以使用动态代理的方式来改进。
- 自定义数据库连接池类

```java
public class MyDataSource implements DataSource{
    //定义集合容器，用于保存多个数据库连接对象
    private static List<Connection> pool = Collections.synchronizedList(new ArrayList<Connection>());

    //静态代码块，生成10个数据库连接保存到集合中
    static {
        for (int i = 0; i < 10; i++) {
            Connection con = JDBCUtils.getConnection();
            pool.add(con);
        }
    }

    //返回连接池的大小
    public int getSize() {
        return pool.size();
    }

    //动态代理方式
    @Override
    public Connection getConnection() {
        if(pool.size() > 0) {
            //从池中获取数据库连接
            Connection con = pool.remove(0);

            Connection proxyCon = (Connection)Proxy.newProxyInstance(con.getClass().getClassLoader(), new Class[]{Connection.class}, new InvocationHandler() {
                /*
                    执行Connection实现类所有方法都会经过invoke
                    如果是close方法，则将连接还回池中
                    如果不是，直接执行实现类的原有方法
                 */
                @Override
                public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                    if(method.getName().equals("close")) {
                        pool.add(con);
                        return null;
                    }else {
                        return method.invoke(con,args);
                    }
                }
            });

            return proxyCon;
        }else {
            throw new RuntimeException("连接数量已用尽");
        }
    }


    //从池中返回一个数据库连接
    /*@Override
    public Connection getConnection() {
        if(pool.size() > 0) {
            //从池中获取数据库连接
            Connection con = pool.remove(0);

            //通过自定义连接对象进行包装
            //MyConnection2 mycon = new MyConnection2(con,pool);
            MyConnection3 mycon = new MyConnection3(con,pool);

            //返回包装后的连接对象
            return mycon;
        }else {
            throw new RuntimeException("连接数量已用尽");
        }
    }*/
}

```

## 2. 开源连接池的使用

### 2.1 C3P0

- 基本使用

```java
/*
    使用C3P0连接池
    1.导入jar包
    2.导入配置文件到src目录下
    3.创建c3p0连接池对象
    4.获取数据库连接进行使用
 */
public class C3P0Demo1 {
    public static void main(String[] args) throws Exception{
        //创建c3p0连接池对象
        DataSource dataSource = new ComboPooledDataSource();

        //获取数据库连接进行使用
        Connection con = dataSource.getConnection();

        //查询全部学生信息
        String sql = "SELECT * FROM student";
        PreparedStatement pst = con.prepareStatement(sql);
        ResultSet rs = pst.executeQuery();

        while(rs.next()) {
            System.out.println(rs.getInt("sid") + "\t" + rs.getString("name") + "\t" + rs.getInt("age") + "\t" + rs.getDate("birthday"));
        }

        //释放资源
        rs.close();
        pst.close();
        con.close();    // 将连接对象归还池中
    }
}

```

- 配置演示

```java
public class C3P0Demo2 {
    public static void main(String[] args) throws Exception{
        //创建c3p0连接池对象
        DataSource dataSource = new ComboPooledDataSource();

        //获取数据库连接进行使用
        for(int i = 1; i <= 11; i++) {
            Connection con = dataSource.getConnection();
            System.out.println(i + ":" + con);
            if(i == 5) {
                con.close();
            }
        }
    }
}

```

### 2.2 Druid

- 基本使用

```java
/*
    Druid连接池
    1.导入jar包
    2.编写配置文件，放在src目录下
    3.通过Properties集合加载配置文件
    4.通过Druid连接池工厂类获取数据库连接池对象
    5.获取数据库连接，进行使用
 */
public class DruidDemo1 {
    public static void main(String[] args) throws Exception{
        //通过Properties集合加载配置文件
        InputStream is = DruidDemo1.class.getClassLoader().getResourceAsStream("druid.properties");
        Properties prop = new Properties();
        prop.load(is);

        //通过Druid连接池工厂类获取数据库连接池对象
        DataSource dataSource = DruidDataSourceFactory.createDataSource(prop);

        //获取数据库连接，进行使用
        Connection con = dataSource.getConnection();

        //查询全部学生信息
        String sql = "SELECT * FROM student";
        PreparedStatement pst = con.prepareStatement(sql);
        ResultSet rs = pst.executeQuery();

        while(rs.next()) {
            System.out.println(rs.getInt("sid") + "\t" + rs.getString("name") + "\t" + rs.getInt("age") + "\t" + rs.getDate("birthday"));
        }

        //释放资源
        rs.close();
        pst.close();
        con.close();    // 将连接对象归还池中
    }
}

```

- 抽取工具类

```java
/*
    数据库连接池工具类
 */
public class DataSourceUtils {
    //1.私有构造方法
    private DataSourceUtils(){}

    //2.定义DataSource数据源变量
    private static DataSource dataSource;

    //3.提供静态代码块，完成配置文件的加载和获取连接池对象
    static {
        try{
            //加载配置文件
            InputStream is = DruidDemo1.class.getClassLoader().getResourceAsStream("druid.properties");
            Properties prop = new Properties();
            prop.load(is);

            //获取数据库连接池对象
            dataSource = DruidDataSourceFactory.createDataSource(prop);

        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    //4.提供获取数据库连接的方法
    public static Connection getConnection() {
        Connection con = null;
        try {
            con = dataSource.getConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return con;
    }

    //5.提供获取数据库连接池的方法
    public static DataSource getDataSource() {
        return dataSource;
    }

    //6.提供释放资源的方法
    public static void close(Connection con, Statement stat, ResultSet rs) {
        if(con != null) {
            try {
                con.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        if(stat != null) {
            try {
                stat.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        if(rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public static void close(Connection con, Statement stat) {
        close(con,stat,null);
    }

}

```
