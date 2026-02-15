package com.milktea.backend.model;

public class OrderItem {
    private Integer orderId;
    private Integer productId;
    private Integer quantity;
    private Integer priceCents;

    public OrderItem() {}

    public OrderItem(Integer orderId, Integer productId, Integer quantity, Integer priceCents) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.priceCents = priceCents;
    }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getPriceCents() { return priceCents; }
    public void setPriceCents(Integer priceCents) { this.priceCents = priceCents; }
}
