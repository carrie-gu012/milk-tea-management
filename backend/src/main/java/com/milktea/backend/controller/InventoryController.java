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

 

    @PostMapping("/{ingredientId}/add")
    public Map<String, Object> addStock(@PathVariable int ingredientId,
                                    @RequestBody Map<String, Double> body) {
        double delta = body.getOrDefault("delta", 0.0);
        inventoryService.addStock(ingredientId, delta);
        return Map.of("ok", true);
    }

    @PutMapping("/{ingredientId}")
    public Map<String, Object> setQuantity(@PathVariable int ingredientId,
                                        @RequestBody Map<String, Double> body) {
        double quantity = body.getOrDefault("quantity", -1.0);
        inventoryService.setQuantity(ingredientId, quantity);
        return Map.of("ok", true);
    }

}
