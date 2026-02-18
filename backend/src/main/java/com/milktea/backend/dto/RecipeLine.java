package com.milktea.backend.dto;

import java.util.Objects;

/**
 * A single line in a product's recipe (for read/detail responses).
 * Contains ingredient display fields for frontend.
 */
public class RecipeLine {

    private Integer ingredientId;
    private String ingredientName;
    private String unit;
    private String type;        // ✅新增：TOPPING / DAIRY / TEA_BASE / SYRUP / CONCENTRATE
    private Double qtyRequired;

    public RecipeLine() {}

    public RecipeLine(Integer ingredientId, String ingredientName, String unit, String type, Double qtyRequired) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.unit = unit;
        this.type = type;
        this.qtyRequired = qtyRequired;
    }

    public Integer getIngredientId() { return ingredientId; }
    public void setIngredientId(Integer ingredientId) { this.ingredientId = ingredientId; }

    public String getIngredientName() { return ingredientName; }
    public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getQtyRequired() { return qtyRequired; }
    public void setQtyRequired(Double qtyRequired) { this.qtyRequired = qtyRequired; }

    @Override
    public String toString() {
        return "RecipeLine{" +
                "ingredientId=" + ingredientId +
                ", ingredientName='" + ingredientName + '\'' +
                ", unit='" + unit + '\'' +
                ", type='" + type + '\'' +
                ", qtyRequired=" + qtyRequired +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RecipeLine)) return false;
        RecipeLine that = (RecipeLine) o;
        return Objects.equals(ingredientId, that.ingredientId) &&
               Objects.equals(ingredientName, that.ingredientName) &&
               Objects.equals(unit, that.unit) &&
               Objects.equals(type, that.type) &&
               Objects.equals(qtyRequired, that.qtyRequired);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ingredientId, ingredientName, unit, type, qtyRequired);
    }
}
