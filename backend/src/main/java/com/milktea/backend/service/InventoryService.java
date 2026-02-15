package com.milktea.backend.service;

import com.milktea.backend.model.Inventory;
import com.milktea.backend.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<Inventory> getLowStock() {
        return inventoryRepository.findLowStock();
    }

    public void addStock(int productId, int delta) {
        if (delta <= 0) throw new IllegalArgumentException("delta must be > 0");
        int updated = inventoryRepository.addStock(productId, delta);
        if (updated == 0) throw new IllegalArgumentException("product not found in inventory");
    }

    public void setQuantity(int productId, int quantity) {
        if (quantity < 0) throw new IllegalArgumentException("quantity must be >= 0");
        int updated = inventoryRepository.updateQuantity(productId, quantity);
        if (updated == 0) throw new IllegalArgumentException("product not found in inventory");
    }
}
