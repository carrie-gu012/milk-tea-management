package com.milktea.backend.dto;

import java.util.List;

public class CreateProductRequest {
    private String name;
    private Integer priceCents;
    private Boolean isActive;
    private List<RecipeLine> recipe;

    public CreateProductRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPriceCents() { return priceCents; }
    public void setPriceCents(Integer priceCents) { this.priceCents = priceCents; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public List<RecipeLine> getRecipe() { return recipe; }
    public void setRecipe(List<RecipeLine> recipe) { this.recipe = recipe; }
}
