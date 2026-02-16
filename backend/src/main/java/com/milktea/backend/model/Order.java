package com.milktea.backend.model;

import java.time.LocalDateTime;

public class Order {
    private Integer orderId;
    private LocalDateTime createdAt;
    private String status;
    private String createdBy;

    public Order() {}

    public Order(Integer orderId, LocalDateTime createdAt, String status, String createdBy) {
        this.orderId = orderId;
        this.createdAt = createdAt;
        this.status = status;
        this.createdBy = createdBy;

        
    }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
