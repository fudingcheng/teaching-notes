package com.itheima.zzyl.controller;

import com.itheima.zzyl.mapper.ReservationMapper;
import com.itheima.zzyl.pojo.PageResult;
import com.itheima.zzyl.pojo.Reservation;
import com.itheima.zzyl.pojo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

/**
 * 预约模块
 */
@RestController
public class ReservationController {

    @Autowired
    private ReservationMapper reservationMapper;

    /**
     * 查询我的预约列表
     * @param userId
     * @param status
     * @param pageNum
     * @param pageSize
     * @return
     */
    @GetMapping("/customer/reservation/page")
    public Result<PageResult<Reservation>> findByPage(
            Integer userId, Integer status, Integer pageNum, Integer pageSize
    ) {
        //创建分页结果对象
        PageResult<Reservation> pr = new PageResult<>();

        //封装数据
        pr.setPage(pageNum);
        pr.setPageSize(pageSize);
        //计算起始索引
        Integer start = (pageNum - 1) * pageSize;
        Long total = reservationMapper.count(userId, status);
        List<Reservation> records = reservationMapper.findPage(userId, status, start, pageSize);
        pr.setTotal(total);
        pr.setRecords(records);
        pr.setPages(total % pageSize == 0 ? total / pageSize : total / pageSize + 1);

        //响应结果对象
        return Result.success(pr);
    }

    /**
     * 新增预约
     * @param params
     * @return
     */
    @PostMapping("/customer/reservation")
    public Result addReservation(@RequestBody HashMap<String,Object> params){
        //补全数据
        //1.补全状态
        params.put("status",0);
        //2.补全创建时间
        params.put("createTime", LocalDateTime.now());
        //3.补全更新时间
        params.put("updateTime",LocalDateTime.now());

        //调用mapper完成添加
        reservationMapper.insert(params);
        return Result.success();
    }

    /**
     * 取消预约
     * @param id
     * @param userId
     * @return
     */
    @PutMapping("/customer/reservation/{id}/cancel")
    public Result cancel(@PathVariable("id") Integer id,Integer userId){
        //封装参数
        HashMap<String,Object> params = new HashMap<>();
        params.put("id",id);
        params.put("userId",userId);
        params.put("updateTime",LocalDateTime.now());

        //调用mapper,完成预约状态修改
        reservationMapper.updateStatus(params);

        return Result.success();
    }
}
