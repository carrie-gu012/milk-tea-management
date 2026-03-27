package com.milktea.backend.model;

public class IngredientUsage {
    private String ingredientName;
    private Double totalQuantityUsed;

    public IngredientUsage() {}

    public IngredientUsage(String ingredientName, Double totalQuantityUsed) {
        this.ingredientName = ingredientName;
        this.totalQuantityUsed = totalQuantityUsed;
    }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }

    public Double getTotalQuantityUsed() { return totalQuantityUsed; }
    public void setTotalQuantityUsed(Double totalQuantityUsed) { this.totalQuantityUsed = totalQuantityUsed; }
}
