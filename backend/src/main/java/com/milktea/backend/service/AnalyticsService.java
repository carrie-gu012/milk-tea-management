package com.milktea.backend.service;

import com.milktea.backend.model.*;
import com.milktea.backend.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public List<TopProduct> getTopSellingProducts() {
        return analyticsRepository.findTopSellingProducts();
    }

    public List<DailySale> getDailySalesLast7Days() {
        return analyticsRepository.findDailySalesLast7Days();
    }

    public List<IngredientUsage> getMostConsumedIngredients() {
        return analyticsRepository.findMostConsumedIngredients();
    }

    public List<LowStockAlert> getLowStockAlerts() {
        return analyticsRepository.findLowStockAlerts();
    }
}