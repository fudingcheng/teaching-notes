package com.itheima.zzyl.pojo;

import java.util.List;

/**
 * 分页结果包装
 *
 * @author itheima
 */
public class PageResult<T> {
    private Long total ;//总条数
    private Integer pageSize ;//每页条数
    private Long pages ;//总页码
    private Integer page ;//页码当前页码
    private List<T> records;//当前页数据

    public PageResult() {
    }

    public PageResult(Long total, Integer pageSize, Long pages, Integer page, List<T> records) {
        this.total = total;
        this.pageSize = pageSize;
        this.pages = pages;
        this.page = page;
        this.records = records;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Long getPages() {
        return pages;
    }

    public void setPages(Long pages) {
        this.pages = pages;
    }

    public Integer getPage() {
        return page;
    }

    public  void setPage(Integer page) {
        this.page = page;
    }

    public List<T> getRecords() {
        return records;
    }

    public void setRecords(List<T> records) {
        this.records = records;
    }

    @Override
    public String toString() {
        return "PageResult{" +
                "total=" + total +
                ", pageSize=" + pageSize +
                ", pages=" + pages +
                ", page=" + page +
                ", records=" + records +
                '}';
    }
}
