package com.milktea.backend.service;

import com.milktea.backend.repository.IngredientRepository;
import com.milktea.backend.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final InventoryRepository inventoryRepository;

    public IngredientService(IngredientRepository ingredientRepository,
                             InventoryRepository inventoryRepository) {
        this.ingredientRepository = ingredientRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public int createIngredient(String name, String unit, double initialQuantity) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("name required");
        if (unit == null || unit.trim().isEmpty()) throw new IllegalArgumentException("unit required");
        if (initialQuantity < 0) throw new IllegalArgumentException("initialQuantity must be >= 0");

        int newId = ingredientRepository.insertIngredient(name.trim(), unit.trim());
        inventoryRepository.insertInventoryRow(newId, initialQuantity);
        return newId;
    }

    public void updateIngredient(int ingredientId, String name, String unit) {
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("name required");
        if (unit == null || unit.trim().isEmpty()) throw new IllegalArgumentException("unit required");

        int updated = ingredientRepository.updateIngredient(ingredientId, name.trim(), unit.trim());
        if (updated == 0) throw new IllegalArgumentException("ingredient not found");
    }

    @Transactional
    public void deleteIngredient(int ingredientId) {
        // 先删 inventory 再删 ingredient，最稳
        inventoryRepository.deleteInventoryRow(ingredientId);
        int deleted = ingredientRepository.deleteIngredient(ingredientId);
        if (deleted == 0) throw new IllegalArgumentException("ingredient not found");
    }
}
