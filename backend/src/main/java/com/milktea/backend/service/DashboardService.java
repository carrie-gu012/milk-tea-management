package com.milktea.backend.service;

import com.milktea.backend.model.DashboardSummary;
import com.milktea.backend.repository.DashboardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public DashboardSummary getSummary() {
        int todayOrders = dashboardRepository.countTodayOrders();
        int revenueCents = dashboardRepository.sumTodayRevenueCents();
        int lowStockItems = dashboardRepository.countLowStockItems();
        int pendingOrders = dashboardRepository.countPendingOrders();
        var recentOrders = dashboardRepository.findRecentOrders(5);
        List<String> alerts = dashboardRepository.findAlerts();

        return new DashboardSummary(
            todayOrders,
            revenueCents,
            lowStockItems,
            pendingOrders,
            recentOrders,
            alerts
        );
    }
}