package com.itheima.zzyl.controller;

import com.itheima.zzyl.mapper.RoomTypeMapper;
import com.itheima.zzyl.pojo.Result;
import com.itheima.zzyl.pojo.RoomType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 房型模块
 */
@RestController
public class RoomTypeController {

    @Autowired
    private RoomTypeMapper roomTypeMapper;

    /**
     * 查询房型列表
     * @param status
     * @return
     */
    @GetMapping("/customer/roomTypes")
    public Result<List<RoomType>> findAll(Integer status){
        List<RoomType> rts = roomTypeMapper.select(status);
        //System.out.println(rts);
        return Result.success(rts);
    }
}
