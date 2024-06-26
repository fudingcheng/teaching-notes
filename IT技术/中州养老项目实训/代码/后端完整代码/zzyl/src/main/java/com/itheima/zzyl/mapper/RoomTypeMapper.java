package com.itheima.zzyl.mapper;

import com.itheima.zzyl.pojo.RoomType;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoomTypeMapper {
    //根据房间状态查询所有房型
    List<RoomType> select(Integer status);
}
