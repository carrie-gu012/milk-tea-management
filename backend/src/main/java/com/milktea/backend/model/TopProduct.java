package com.milktea.backend.model;

public class TopProduct {
    private String productName;
    private Integer totalQuantitySold;

    public TopProduct() {}

    public TopProduct(String productName, Integer totalQuantitySold) {
        this.productName = productName;
        this.totalQuantitySold = totalQuantitySold;
    }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getTotalQuantitySold() { return totalQuantitySold; }
    public void setTotalQuantitySold(Integer totalQuantitySold) { this.totalQuantitySold = totalQuantitySold; }
}