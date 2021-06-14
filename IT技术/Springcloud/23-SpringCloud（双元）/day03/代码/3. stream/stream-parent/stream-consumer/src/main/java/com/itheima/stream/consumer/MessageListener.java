package com.itheima.stream.consumer;

import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

/**
 * 消息接收类
 */
@EnableBinding({Sink.class})
@Component
public class MessageListener {

    @StreamListener(Sink.INPUT)
    public void receive(Message message){

        System.out.println(message);
        System.out.println(message.getPayload());
    }
}
