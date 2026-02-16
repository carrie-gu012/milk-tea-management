package com.milktea.backend.model;

public class Ingredient {
  private Integer ingredientId;
  private String name;
  private String unit;

  public Ingredient() {}
  public Ingredient(Integer ingredientId, String name, String unit) {
    this.ingredientId = ingredientId;
    this.name = name;
    this.unit = unit;
  }

  public Integer getIngredientId() {
    return ingredientId;
  }
  public void setIngredientId(Integer ingredientId) {
    this.ingredientId = ingredientId;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getUnit() {
    return unit;
  }
  public void setUnit(String unit) {
    this.unit = unit;
  }
}