package com.milktea.backend.model;

public class Inventory {
  private Integer ingredientId;
  private String ingredientName; 
  private String unit;           
  private Double quantity;

  public Inventory() {}
  public Inventory(Integer ingredientId, String ingredientName, String unit, Double quantity) {
    this.ingredientId = ingredientId;
    this.ingredientName = ingredientName;
    this.unit = unit;
    this.quantity = quantity;
  }
  
  // Getters and setters
  public Integer getIngredientId() { return ingredientId; }
  public void setIngredientId(Integer ingredientId) { this.ingredientId = ingredientId; }
  public String getIngredientName() { return ingredientName; }
  public void setIngredientName(String ingredientName) { this.ingredientName = ingredientName; }
  public String getUnit() { return unit; }
  public void setUnit(String unit) { this.unit = unit; }
  public Double getQuantity() { return quantity; }
  public void setQuantity(Double quantity) { this.quantity = quantity; }
}
