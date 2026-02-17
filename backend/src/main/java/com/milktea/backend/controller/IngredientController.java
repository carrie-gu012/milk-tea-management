package com.milktea.backend.controller;

import com.milktea.backend.service.IngredientService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    public static class CreateIngredientRequest {
        public String ingredientName;   // 前端用 ingredientName
        public String unit;
        public Double initialQuantity;  // 可选
    }

    public static class UpdateIngredientRequest {
        public String ingredientName;
        public String unit;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody CreateIngredientRequest req) {
        double initialQty = (req.initialQuantity == null) ? 0.0 : req.initialQuantity;
        int id = ingredientService.createIngredient(req.ingredientName, req.unit, initialQty);
        return Map.of("ok", true, "ingredientId", id);
    }

    @PutMapping("/{ingredientId}")
    public Map<String, Object> update(@PathVariable int ingredientId,
                                      @RequestBody UpdateIngredientRequest req) {
        ingredientService.updateIngredient(ingredientId, req.ingredientName, req.unit);
        return Map.of("ok", true);
    }

    @DeleteMapping("/{ingredientId}")
    public Map<String, Object> delete(@PathVariable int ingredientId) {
        ingredientService.deleteIngredient(ingredientId);
        return Map.of("ok", true);
    }
}