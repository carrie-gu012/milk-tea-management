package com.milktea.backend.controller;

import com.milktea.backend.model.*;
import com.milktea.backend.service.AnalyticsService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // Only admin can access analytics
    private void requireAdmin(HttpServletRequest request) {
        String role = request.getHeader("X-ROLE");
        if (role == null || !"ADMIN".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }

    @GetMapping("/top-products")
    public List<TopProduct> getTopProducts(HttpServletRequest request) {
        requireAdmin(request);
        return analyticsService.getTopSellingProducts();
    }

    @GetMapping("/daily-sales")
    public List<DailySale> getDailySales(HttpServletRequest request) {
        requireAdmin(request);
        return analyticsService.getDailySalesLast7Days();
    }

    @GetMapping("/most-consumed")
    public List<IngredientUsage> getMostConsumed(HttpServletRequest request) {
        requireAdmin(request);
        return analyticsService.getMostConsumedIngredients();
    }

    @GetMapping("/low-stock")
    public List<LowStockAlert> getLowStock(HttpServletRequest request) {
        requireAdmin(request);
        return analyticsService.getLowStockAlerts();
    }
}