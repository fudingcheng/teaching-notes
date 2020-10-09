package com.itheima.stream.producer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProducerController {

    @Autowired
    private MessageProducer producer;


    @RequestMapping("/send")
        public String sendMsg(){
        producer.send();
        return "success";
    }
}
