package com.itheima.zzyl.pojo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
    实体类：NursingProject（护理项目）
 */
public class NursingProject {
    private Long id;//主键
    private String name;//名称
    private Integer orderNo;//排序号
    private String unit;//单位
    private BigDecimal price;//价格
    private String image;//图片
    private String nursingRequirement;//护理要求
    private Integer status;//状态（0：禁用，1：启用）
    public LocalDateTime createTime;//创建时间
    public LocalDateTime updateTime;//更新时间
    private Long createBy;//创建人
    private Long updateBy;//更新人
    private String remark;//备注

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getNursingRequirement() {
        return nursingRequirement;
    }

    public void setNursingRequirement(String nursingRequirement) {
        this.nursingRequirement = nursingRequirement;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    public Long getCreateBy() {
        return createBy;
    }

    public void setCreateBy(Long createBy) {
        this.createBy = createBy;
    }

    public Long getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(Long updateBy) {
        this.updateBy = updateBy;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @Override
    public String toString() {
        return "NursingProject{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", orderNo=" + orderNo +
                ", unit='" + unit + '\'' +
                ", price=" + price +
                ", image='" + image + '\'' +
                ", nursingRequirement='" + nursingRequirement + '\'' +
                ", status=" + status +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", createBy=" + createBy +
                ", updateBy=" + updateBy +
                ", remark='" + remark + '\'' +
                '}';
    }
}
