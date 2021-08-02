package com.itheima.exce;


import java.util.Scanner;

public class ExceptionDemo12 {
    public static void main(String[] args) throws Exception{
        // 需求：录入一个学生对象，要求如下
        //  1. 年龄必须是数字,如果录入的不是,提示用户重新录入
        //  2. 年龄17-25之间,如果超出范围,程序停止

        Student student = new Student();

        // 开始接受用户录入的数据
        Scanner scanner  = new Scanner(System.in);

        System.out.println("请录入学生姓名:");
        String name = scanner.nextLine();
        student.setName(name);

        System.out.println("请录入学生年龄:");
        while (true){
            String ageStr = scanner.nextLine();
            try {
                int age = Integer.parseInt(ageStr);

                if(age<17 || age>25){
                    //程序停止
                    //throw new RuntimeException("请录入一个17~25之间的数字");      // AgeOutOfBoundsException
                    throw new AgeOutOfBoundsException("请录入一个17~25之间的数字");
                }
                student.setAge(age);
                break;
            } catch (NumberFormatException e) {
                //代表用户录入的是非数字
                //System.out.println( e.getMessage());;
                //System.out.println( e.toString());
                e.printStackTrace();
                System.out.println("请输入数字:");
                continue;
            }
        }
        System.out.println(student);
    }
}
