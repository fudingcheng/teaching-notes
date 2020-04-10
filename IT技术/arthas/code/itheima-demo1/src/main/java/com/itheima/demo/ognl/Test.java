package com.itheima.demo.ognl;

import java.util.*;

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

            Thread.sleep(1000L);
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