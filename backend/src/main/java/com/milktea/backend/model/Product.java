package com.milktea.backend.model;

public class Product {

    private Integer productId;
    private String name;
    private Integer priceCents;
    private Boolean isActive;

    public Product() {} 

    public Product(Integer productId, String name, Integer priceCents, Boolean isActive) {
        this.productId = productId;
        this.name = name;
        this.priceCents = priceCents;
        this.isActive = isActive;
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPriceCents() { return priceCents; }
    public void setPriceCents(Integer priceCents) { this.priceCents = priceCents; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
