package com.milktea.backend.model;

public class LowStockAlert {
    private String ingredientName;
    private Double currentQuantity;
    private Double threshold;

    public LowStockAlert() {}

    public LowStockAlert(String ingredientName, Double currentQuantity, Double threshold) {
        this.ingredientName = ingredientName;
        this.currentQuantity = currentQuantity;
        this.threshold = threshold;
    }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }

    public Double getCurrentQuantity() { return currentQuantity; }
    public void setCurrentQuantity(Double currentQuantity) { this.currentQuantity = currentQuantity; }

    public Double getThreshold() { return threshold; }
    public void setThreshold(Double threshold) { this.threshold = threshold; }
}
