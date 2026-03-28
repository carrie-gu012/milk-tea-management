package com.milktea.backend.model;

public class RecentOrderItem {
    private Integer orderId;
    private String status;
    private String createdBy;

    public RecentOrderItem() {}

    public RecentOrderItem(Integer orderId, String status, String createdBy) {
        this.orderId = orderId;
        this.status = status;
        this.createdBy = createdBy;
    }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}