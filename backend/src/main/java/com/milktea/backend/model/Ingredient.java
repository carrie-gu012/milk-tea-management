// src/main/java/com/milktea/backend/model/Ingredient.java
package com.milktea.backend.model;

public class Ingredient {
  private Integer ingredientId;
  private String name;
  private String unit;
  private String type; 

  public Ingredient() {}

  public Ingredient(Integer ingredientId, String name, String unit, String type) {
    this.ingredientId = ingredientId;
    this.name = name;
    this.unit = unit;
    this.type = type;
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

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }
}
