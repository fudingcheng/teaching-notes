# 1. mybatis-plus枚举

数据库中有些字典值（比如性别用数字表示，1代表男，2代表女），这些数据返回给用户时需要进行转换为用户识别的数据。

Mybatis-plus提供枚举机制能够实现自动转换

## 1.1 创建枚举类

```java
package com.itheima.mp.entity;

public enum SexEnum implements IEnum<Integer> {

    MAN(1, "男"),
    WOMEN(2, "女");


    private Integer code;
    private String desc;

    SexEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }


    @Override
    public Integer getValue() {
        return this.code;
    }

    @Override
    public String toString() {
        return this.desc;
    }
}
```

## 1.2 实体中引用枚举类

```java
@Data
public class User {

private Long id;
private String userName;
private String password;
private String name;
private Integer age;
private String email;
private SexEnum sex;		//用枚举类代表类型
```

## 1.3 编写配置文件

```yaml
mybatis-plus:
  type-enums-package: com.itheima.mp.enums
```

## 1.4 测试

```java
@Test
public void findUserById(){
    User user = userMapper.selectById(2);
    System.out.println(user);
}
```

# 2. 自动填充功能

操作数据库时，通常要记录添加/修改数据的时间，使用mybatis-plus可以帮助开发者自动填充记录时间字段。

## 2.1 在数据中添加字段

![image-20201114185718785](assets/image-20201114185718785.png)

## 2.2 在实体类中添加属性

```java
@Data
public class User {

private Long id;
private String userName;
private String password;
private String name;
private Integer age;
private String email;
private SexEnum sex;		//用枚举类代表类型
    
@TableField(fill= FieldFill.INSERT)
private Date createTime;

@TableField(fill= FieldFill.UPDATE)
private Date updateTime;    
```

## 2.3 测试

```java
@Test
public void insertUser(){
   User user = new User();
   user.setUserName("test");
   user.setPassword("123456");
   user.setSex(SexEnum.MAN);

   userMapper.insert(user);
}
```

```java
@Test
public void updateUser(){
    User user = new User();
    user.setUserName("test111");
    user.setPassword("123456");
    user.setSex(SexEnum.MAN);
    user.setId(16L);
    userMapper.updateById(user);
}
```

