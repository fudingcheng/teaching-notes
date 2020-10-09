package com.itheima.nacos.dao;

import com.itheima.nacos.domain.Goods;
import org.springframework.stereotype.Repository;

/**
 * 商品Dao
 */

@Repository
public class GoodsDao {


    public Goods findOne(int id){
        return new Goods(1,"华为手机",3999,10000);
    }
}
