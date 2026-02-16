package com.milktea.backend.dto;

import java.util.List;

public class ProductDetailDto {
    private Integer productId;
    private String name;
    private Integer priceCents;
    private Boolean isActive;

    private List<RecipeLine> recipe; // 你之前写的 RecipeLine（带 ingredientName/unit 的那个）

    public ProductDetailDto() {}

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPriceCents() { return priceCents; }
    public void setPriceCents(Integer priceCents) { this.priceCents = priceCents; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public List<RecipeLine> getRecipe() { return recipe; }
    public void setRecipe(List<RecipeLine> recipe) { this.recipe = recipe; }
}
