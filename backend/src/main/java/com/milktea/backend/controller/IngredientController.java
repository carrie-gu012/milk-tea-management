package com.milktea.backend.controller;

import com.milktea.backend.service.IngredientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {
    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    // ✅ 用于列表返回（给前端下拉用）
    public static class IngredientItem {
        public Integer ingredientId;
        public String ingredientName;
        public String unit;
        public String type;

        public IngredientItem(Integer ingredientId, String ingredientName, String unit, String type) {
            this.ingredientId = ingredientId;
            this.ingredientName = ingredientName;
            this.unit = unit;
            this.type = type;
        }
    }

    public static class CreateIngredientRequest {
        public String ingredientName;
        public String unit;
        public String type;
        public Double initialQuantity;
    }

    public static class UpdateIngredientRequest {
        public String ingredientName;
        public String unit;
        public String type;
    }

    // ✅ 新增：给 Product/Recipe Editor 用（按 type 分组）
    @GetMapping
    public List<IngredientItem> listAll() {
        return ingredientService.listAllIngredients();
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody CreateIngredientRequest req) {
        double initialQty = (req.initialQuantity == null) ? 0.0 : req.initialQuantity;
        int id = ingredientService.createIngredient(req.ingredientName, req.unit, req.type, initialQty);
        return Map.of("ok", true, "ingredientId", id);
    }

    @PutMapping("/{ingredientId}")
    public Map<String, Object> update(@PathVariable int ingredientId,
                                      @RequestBody UpdateIngredientRequest req) {
        ingredientService.updateIngredient(ingredientId, req.ingredientName, req.unit, req.type);
        return Map.of("ok", true);
    }

    @DeleteMapping("/{ingredientId}")
    public Map<String, Object> delete(@PathVariable int ingredientId) {
        ingredientService.deleteIngredient(ingredientId);
        return Map.of("ok", true);
    }
}
