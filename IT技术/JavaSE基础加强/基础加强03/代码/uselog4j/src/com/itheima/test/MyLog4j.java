package com.itheima.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Scanner;

public class MyLog4j {

    //获取日志对象
    private static final Logger LOGGER = LoggerFactory.getLogger(MyLog4j.class);

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        //键盘录入一个数字
        String number = sc.nextLine();

        //类型转换
        try {
            int result = Integer.parseInt(number);
           // System.out.println("类型转换成功" + result);
            LOGGER.info("类型转换成功" + result);
        } catch (NumberFormatException e) {
           // System.out.println("类型转换失败，请录入一个整数");
            LOGGER.info("类型转换失败，请录入一个整数");
        }
    }
}
