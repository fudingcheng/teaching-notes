package com.itheima.junitdemo1;

import org.junit.Test;

public class JunitDemo1 {

    public static void main(String[] args) {

    }

    @Test
    public void add() {
        System.out.println(2 / 0);
        int a = 10;
        int b = 20;
        int sum = a + b;
        System.out.println(sum);
    }


}
