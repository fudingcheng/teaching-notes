package com.itheima.nacos.controller;


import com.itheima.nacos.domain.Goods;
import com.itheima.nacos.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    @GetMapping("/findOne/{id}")
    public Goods findOne(@PathVariable("id") int id){

        Goods goods = goodsService.findOne(id);

        return goods;
    }
}
