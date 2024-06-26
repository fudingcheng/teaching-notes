package com.itheima.zzyl.mapper;

import com.itheima.zzyl.pojo.Reservation;
import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface ReservationMapper {

    //查询总记录数
    Long count(Integer userId, Integer status);

    //查询当前页数据
    List<Reservation> findPage(Integer userId, Integer status, Integer start, Integer pageSize);

    //完成预约新增
    void insert(HashMap<String, Object> params);

    //修改预约状态
    void updateStatus(HashMap<String,Object> params);
}
