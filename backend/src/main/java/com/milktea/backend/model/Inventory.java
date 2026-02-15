package com.milktea.backend.model;

public class Inventory {
    private Integer productId;
    private Integer quantity;
    private Integer lowStockThreshold;

    public Inventory() {}

    public Inventory(Integer productId, Integer quantity, Integer lowStockThreshold) {
        this.productId = productId;
        this.quantity = quantity;
        this.lowStockThreshold = lowStockThreshold;
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }
}
