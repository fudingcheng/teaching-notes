package com.itheima.consumer.hystrix.fallback;

import com.itheima.consumer.domain.Goods;
import com.itheima.consumer.feign.FeinProviderClient;
import org.springframework.stereotype.Component;

@Component
public class FeinProviderClientFallBack implements FeinProviderClient {
    @Override
    public Goods findOne(int id) {
        Goods goods = new Goods();
        goods.setId(1);
        goods.setTitle("触发降级");
        goods.setCount(999);
        goods.setPrice(0);
        return goods;
    }
}
