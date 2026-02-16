package com.milktea.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDetailResponse {
    private Integer orderId;
    private LocalDateTime createdAt;
    private String status;
    private String createdBy;
    private List<Item> items;

    public OrderDetailResponse() {}

    public OrderDetailResponse(Integer orderId, LocalDateTime createdAt, String status, List<Item> items) {
        this.orderId = orderId;
        this.createdAt = createdAt;
        this.status = status;
        this.items = items;
    }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    public static class Item {
        private Integer productId;
        private String productName;   
        private Integer quantity;
        private Integer priceCents;

        public Item() {}

        public Item(Integer productId, String productName, Integer quantity, Integer priceCents) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.priceCents = priceCents;
        }

        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Integer getPriceCents() { return priceCents; }
        public void setPriceCents(Integer priceCents) { this.priceCents = priceCents; }
    }
}
