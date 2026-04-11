package com.milktea.backend.service;

import com.milktea.backend.model.Inventory;
import com.milktea.backend.repository.InventoryRepository;
import org.springframework.stereotype.Service;
import com.milktea.backend.repository.ProductRepository;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                        ProductRepository productRepository) {
    this.inventoryRepository = inventoryRepository;
    this.productRepository = productRepository;
}

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public void addStock(int ingredientId, double delta) {
    if (delta <= 0) throw new IllegalArgumentException("delta must be > 0");
    int updated = inventoryRepository.addStock(ingredientId, delta);
    if (updated == 0) throw new IllegalArgumentException("ingredient not found in inventory");

    productRepository.deactivateUnsellableProducts();
    }

    public void setQuantity(int ingredientId, double quantity) {
    if (quantity < 0) throw new IllegalArgumentException("quantity must be >= 0");
    int updated = inventoryRepository.setQuantity(ingredientId, quantity);
    if (updated == 0) throw new IllegalArgumentException("ingredient not found in inventory");

    productRepository.deactivateUnsellableProducts();
    }
}
