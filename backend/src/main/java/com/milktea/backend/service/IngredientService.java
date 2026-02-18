package com.milktea.backend.service;

import com.milktea.backend.controller.IngredientController;
import com.milktea.backend.repository.IngredientRepository;
import com.milktea.backend.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final InventoryRepository inventoryRepository;

    // ✅ 5类（与你的 ENUM 完全一致）
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "TOPPING",
            "DAIRY",
            "TEA_BASE",
            "SYRUP",
            "CONCENTRATE"
    );

    public IngredientService(IngredientRepository ingredientRepository,
                             InventoryRepository inventoryRepository) {
        this.ingredientRepository = ingredientRepository;
        this.inventoryRepository = inventoryRepository;
    }

    private static String normalizeType(String type) {
        if (type == null) throw new IllegalArgumentException("type required");
        String t = type.trim().toUpperCase();
        if (t.isEmpty()) throw new IllegalArgumentException("type required");
        if (!ALLOWED_TYPES.contains(t)) {
            throw new IllegalArgumentException("invalid type: " + type +
                    " (allowed: TOPPING, DAIRY, TEA_BASE, SYRUP, CONCENTRATE)");
        }
        return t;
    }

    // ✅ 新增：给 Product/Recipe Editor 用（按 type 分组下拉）
    public List<IngredientController.IngredientItem> listAllIngredients() {
        List<Map<String, Object>> rows = ingredientRepository.findAll();

        return rows.stream().map(r -> new IngredientController.IngredientItem(
                ((Number) r.get("ingredient_id")).intValue(),
                (String) r.get("name"),
                (String) r.get("unit"),
                (String) r.get("type")
        )).collect(Collectors.toList());
    }

    @Transactional
    public int createIngredient(String name, String unit, String type, double initialQuantity) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("name required");
        if (unit == null || unit.trim().isEmpty()) throw new IllegalArgumentException("unit required");
        if (initialQuantity < 0) throw new IllegalArgumentException("initialQuantity must be >= 0");

        String t = normalizeType(type);

        int newId = ingredientRepository.insertIngredient(name.trim(), unit.trim(), t);
        inventoryRepository.insertInventoryRow(newId, initialQuantity);
        return newId;
    }

    public void updateIngredient(int ingredientId, String name, String unit, String type) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("name required");
        if (unit == null || unit.trim().isEmpty()) throw new IllegalArgumentException("unit required");

        String t = normalizeType(type);

        int updated = ingredientRepository.updateIngredient(ingredientId, name.trim(), unit.trim(), t);
        if (updated == 0) throw new IllegalArgumentException("ingredient not found");
    }

    @Transactional
    public void deleteIngredient(int ingredientId) {
        inventoryRepository.deleteInventoryRow(ingredientId);
        int deleted = ingredientRepository.deleteIngredient(ingredientId);
        if (deleted == 0) throw new IllegalArgumentException("ingredient not found");
    }
}
