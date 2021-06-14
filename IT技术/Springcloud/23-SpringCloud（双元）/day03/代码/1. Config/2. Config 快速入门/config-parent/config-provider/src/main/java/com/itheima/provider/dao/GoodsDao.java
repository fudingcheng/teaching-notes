package com.itheima.provider.dao;

import com.itheima.provider.domain.Goods;
import org.springframework.stereotype.Repository;

import javax.validation.ReportAsSingleViolation;

/**
 * 商品Dao
 */

@Repository
public class GoodsDao {


    public Goods findOne(int id){
        return new Goods(1,"华为手机",3999,10000);
    }
}
