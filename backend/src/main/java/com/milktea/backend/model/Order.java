package com.milktea.backend.model;

import java.time.LocalDateTime;

public class Order {
    private Integer orderId;
    private LocalDateTime createdAt;
    private String status;

    public Order() {}

    public Order(Integer orderId, LocalDateTime createdAt, String status) {
        this.orderId = orderId;
        this.createdAt = createdAt;
        this.status = status;
    }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
