package com.itheima.consumer.feign;

import com.itheima.consumer.config.RestTemplateConfig;
import com.itheima.consumer.domain.Goods;
import com.itheima.consumer.hystrix.fallback.FeinProviderClientFallBack;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "FEIGN-PROVIDER",configuration = RestTemplateConfig.class,fallback = FeinProviderClientFallBack.class)
public interface FeinProviderClient {


    @GetMapping("/goods/findOne/{id}")
    public Goods findOne(@PathVariable("id") int id);
}
