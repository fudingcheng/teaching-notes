package com.itheima.consul.service;

import com.itheima.consul.dao.GoodsDao;
import com.itheima.consul.domain.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Goods 业务层
 */
@Service
public class GoodsService {

    @Autowired
    private GoodsDao goodsDao;


    /**
     * 根据id查询
     * @param id
     * @return
     */
    public Goods findOne(int id){
        return goodsDao.findOne(id);
    }
}
