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
    private Double qtyRequired;

    public RecipeLine() {}

    public RecipeLine(Integer ingredientId, String ingredientName, String unit, Double qtyRequired) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.unit = unit;
        this.qtyRequired = qtyRequired;
    }

    public Integer getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(Integer ingredientId) {
        this.ingredientId = ingredientId;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getQtyRequired() {
        return qtyRequired;
    }

    public void setQtyRequired(Double qtyRequired) {
        this.qtyRequired = qtyRequired;
    }

    @Override
    public String toString() {
        return "RecipeLine{" +
                "ingredientId=" + ingredientId +
                ", ingredientName='" + ingredientName + '\'' +
                ", unit='" + unit + '\'' +
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
               Objects.equals(qtyRequired, that.qtyRequired);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ingredientId, ingredientName, unit, qtyRequired);
    }
}
