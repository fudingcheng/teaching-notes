package com.itheima.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/controller1")
public class Controller1 {


    @RequestMapping("/sayHi")
    public String sayHi(String name) {

        BlockThread thread1 = new BlockThread(Controller1.class);
        BlockThread thread2 = new BlockThread(Controller1.class);

        thread1.run();
        thread2.run();

        return "hello:" + name;
    }


    class BlockThread implements Runnable {

        private Object object;

        public BlockThread(Object object) {
            this.object = object;
        }

        @Override
        public void run() {
            synchronized (object) {
                System.out.println("thread:" + Thread.currentThread().getName());
                while (true){

                }
            }
        }
    }

}
