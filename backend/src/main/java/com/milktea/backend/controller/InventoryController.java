package com.milktea.backend.controller;

import com.milktea.backend.model.Inventory;
import com.milktea.backend.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<Inventory> getAll() {
        return inventoryService.getAllInventory();
    }

 

    @PostMapping("/{productId}/add")
    public Map<String, Object> addStock(@PathVariable int productId, @RequestBody Map<String, Integer> body) {
        int delta = body.getOrDefault("delta", 0);
        inventoryService.addStock(productId, delta);
        return Map.of("ok", true);
    }

    @PutMapping("/{productId}")
    public Map<String, Object> setQuantity(@PathVariable int productId, @RequestBody Map<String, Integer> body) {
        int quantity = body.getOrDefault("quantity", -1);
        inventoryService.setQuantity(productId, quantity);
        return Map.of("ok", true);
    }
}
