package com.itheima.zzyl.controller;

import com.itheima.zzyl.mapper.NursingProjectMapper;
import com.itheima.zzyl.pojo.NursingProject;
import com.itheima.zzyl.pojo.PageResult;
import com.itheima.zzyl.pojo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 护理项目模块
 */
@RestController
public class NursingProjectController {

    @Autowired
    private NursingProjectMapper nursingProjectMapper;

    /**
     * 护理项目分页
     *
     * @param pageNum
     * @param pageSize
     * @return
     */
    @GetMapping("/customer/orders/project/page")
    public Result<PageResult<NursingProject>> findPage(Integer pageNum, Integer pageSize) {
        //创建分页结果对象
        PageResult<NursingProject> pr = new PageResult<>();
        //封装数据
        pr.setPage(pageNum);
        pr.setPageSize(pageSize);
        //查询总记录数
        Long total = nursingProjectMapper.count();
        pr.setTotal(total);
        //计算总页码
        Long pages = total % pageSize == 0 ? total / pageSize : total / pageSize + 1;
        pr.setPages(pages);

        //查询当前页数据
        Integer start = (pageNum - 1) * pageSize;
        List<NursingProject> nps = nursingProjectMapper.findPage(start, pageSize);
        pr.setRecords(nps);

        return Result.success(pr);
    }

    /**
     * 查询护理项目详情
     *
     * @param id
     * @return
     */
    @GetMapping("/customer/orders/project/{id}")
    public Result<NursingProject> detail(@PathVariable("id") Integer id) {
        //调用mapper查询
        NursingProject nursingProject = nursingProjectMapper.selectById(id);
        return Result.success(nursingProject);
    }
}
