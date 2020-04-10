### 前言

Arthas 3.0中使用ognl表达式替换了groovy来实现表达式的求值功能，解决了groovy潜在会出现内存泄露的问题。灵活运用ognl表达式，能够极大提升问题排查的效率。

ognl官方文档：<https://commons.apache.org/proper/commons-ognl/language-guide.html>

### 一个测试应用

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * @author zhuyong on 2017/9/13.
 */
public class Test {

    public static final Map m = new HashMap<>();
    public static final Map n = new HashMap<>();

    static {
        m.put("a", "aaa");
        m.put("b", "bbb");

        n.put(Type.RUN, "aaa");
        n.put(Type.STOP, "bbb");
    }

    public static void main(String[] args) throws InterruptedException {
        List<Pojo> list = new ArrayList<>();

        for (int i = 0; i < 40; i ++) {
            Pojo pojo = new Pojo();
            pojo.setName("name " + i);
            pojo.setAge(i + 2);

            list.add(pojo);
        }

        while (true) {
            int random = new Random().nextInt(40);

            String name = list.get(random).getName();
            list.get(random).setName(null);

            test(list);

            list.get(random).setName(name);

            Thread.sleep(1000l);
        }
    }

    public static void test(List<Pojo> list) {

    }

    public static void invoke(String a) {
        System.out.println(a);
    }

    static class Pojo {
        String name;
        int age;
        String hobby;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getHobby() {
            return hobby;
        }

        public void setHobby(String hobby) {
            this.hobby = hobby;
        }
    }
}

public enum Type {
    RUN, STOP;
}
```

#### 查看第一个参数

params是参数列表，是一个数组，可以直接通过下标方式访问

```
$ watch Test test params[0] -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 26 ms.
@ArrayList[
    @Pojo[Test$Pojo@6e2c634b],
    @Pojo[Test$Pojo@37a71e93],
    @Pojo[Test$Pojo@7e6cbb7a],
    ...
]
```

> 这里的-n表示只输出一次

#### 查看数组中的元素

第一个参数是一个List，想要看List中第一个Pojo对象，可以通过下标方式，也可以通过List的get方法访问。

```
$ watch Test test params[0][0] -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 14 ms.
@Pojo[
    name=@String[name 0],
    age=@Integer[2],
    hobby=null,
]

$ watch Test test params[0].get(0) -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 14 ms.
@Pojo[
    name=@String[name 0],
    age=@Integer[2],
    hobby=null,
]
```

#### 查看Pojo的属性

拿到这个Pojo可以，直接访问Pojo的属性，如age

```
$ watch Test test params[0].get(0).age -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 21 ms.
@Integer[2]
```

还可以通过下标的方式访问`params[0][0]["age"]`，这个写法等效于`params[0][0].age`：

```
$ watch Test test params[0][0]["name"] -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 53 ms.
watch failed, condition is: null, express is: params[0][0][age], ognl.NoSuchPropertyException: com.taobao.arthas.core.advisor.Advice.age, visit /Users/wangtao/logs/arthas/arthas.log for more details.
```

但这样会报错，这时候需要再加一个引号

```
$ watch Test test 'params[0][0]["age"]' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 25 ms.
@Integer[2]
```

#### 集合投影

有时候我们只需要抽取对象数组中的某一个属性，这种情况可以通过投影来实现，比如要将Pojo对象列表中的name属性单独抽出来，可以通过`params[0].{name}`这个表达式来实现。 ognl会便利params[0]这个List取出每个对象的name属性，重新组装成一个新的数组。用法相当于Java stream中的map函数。

```
$ watch Test test params[0].{name} -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 56 ms.
@ArrayList[
    @String[name 0],
    @String[name 1],
    @String[name 2],
    @String[name 3],
    null,
    @String[name 5],
    @String[name 6],
    @String[name 7],
    @String[name 8],
    @String[name 9],
]
```

#### 集合过滤

有时候还需要针对集合对象按某种条件进行过滤，比如想找出所有age大于5的Pojo的name，可以这样写

```
$ watch Test test "params[0].{? #this.age > 5}.{name}" -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 25 ms.
@ArrayList[
    @String[name 4],
    @String[name 5],
    @String[name 6],
    null,
    @String[name 8],
    @String[name 9],
]
```

其中`{? #this.age > 5}` 相当于stream里面的filter，后面的`name`相当于stream里面的map

那如果要找到第一个age大于5的Pojo的name，怎么办呢？可以用`^`或`$`来进行第一个或最后一个的匹配，像下面这样:

```
$ watch Test test "params[0].{^ #this.age > 5}.{name}" -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 24 ms.
@ArrayList[
    @String[name 4],
]
Command hit execution time limit 1, therefore will be aborted.
$ watch Test test "params[0].{$ #this.age > 5}.{name}" -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 43 ms.
@ArrayList[
    @String[name 9],
]
```

#### 多行表达式

有些表达式一行之内无法表达，需要多行才能表达，应该怎么写的？比如，假设我们要把所有Pojo的name拿出来，再往里面新加一个新的元素，在返回新的列表，应该如何写？可以通过中括号将多个表达式串联起来，最后一个表达式的返回值代表整个表达式的最终结果。临时变量可以用`#`来表示。

```
$ watch Test test '(#test=params[0].{name}, #test.add("abc"), #test)' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 28 ms.
@ArrayList[
    @String[name 0],
    @String[name 1],
    @String[name 2],
    @String[name 3],
    @String[name 4],
    @String[name 5],
    @String[name 6],
    @String[name 7],
    @String[name 8],
    null,
    @String[abc],
]
```

#### 调用构造函数

调用构造函数，必须要指定要创建的类的`全类名`。比如下面的例子中，创建一个新的list，然后添加一个新的元素，然后返回添加后的list。

```
$ watch Test test '(#test=new java.util.ArrayList(), #test.add("abc"), #test)' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 37 ms.
@ArrayList[
    @String[abc],
]
```

#### 访问静态变量

可以通过`@class@filed`方式访问，注意需要填写全类名

```
$ watch Test test '@Test@m' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 35 ms.
@HashMap[
    @String[a]:@String[aaa],
    @String[b]:@String[bbb],
]
```

#### 调用静态方法

可以通过`@class@method(args)`方式访问，注意需要填写全类名

```
$ watch Test test '@java.lang.System@getProperty("java.version")' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 42 ms.
@String[1.8.0_51]
```

静态方法和非静态方法结合，例如想要获取当前方法调用的TCCL，可以像下面这样写：

```
$ watch Test test '@java.lang.Thread@currentThread().getContextClassLoader()' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 84 ms.
@AppClassLoader[
    ucp=@URLClassPath[sun.misc.URLClassPath@4cdbe50f],
    $assertionsDisabled=@Boolean[true],
]
```

#### 访问Map中的元素

Test.n是一个HashMap，假设要获取这个Map的所有key，ongl针对Map接口提供了`keys`, `values`这两个虚拟属性，可以像普通属性一样访问。

```
$ watch Test test '@Test@n.keys' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 57 ms.
@KeySet[
    @Type[RUN],
    @Type[STOP],
]
```

因为这个Map的Key是一个Enum，假设要把key为RUN这个值的value取出来应该怎么写呢？可以通过Enum的`valueOf`方法来创建一个Enum，然后get出来，比如下面一样

```
$ watch Test test '@Test@n.get(@Type@valueOf("RUN"))' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 168 ms.
@String[aaa]
```

或者是下面这样，通过迭代器+过滤的方式：

```
$ watch Test test '@Test@n.entrySet().iterator.{? #this.key.name() == "RUN"}' -n 1
Press Ctrl+C to abort.
Affect(class-cnt:1 , method-cnt:1) cost in 72 ms.
@ArrayList[
    @Node[RUN=aaa],
]
```

#### 附录: ognl内置的ognl的虚拟属性

- Collection:
  - size
  - isEmpty
- List:
  - iterator
- Map:
  - keys
  - values
- Set:
  - iterator
- Iterator:
  - next
  - hasNext
- Enumeration:
  - next
  - hasNext
  - nextElement
  - hasMoreElements