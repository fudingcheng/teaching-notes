package com.itheima.zzyl.mapper;

import com.itheima.zzyl.pojo.NursingProject;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NursingProjectMapper {
    //查询总记录条数
    Long count();

    //查询指定页数据
    List<NursingProject> findPage(Integer start, Integer pageSize);

    //根据id查询
    NursingProject selectById(Integer id);
}
