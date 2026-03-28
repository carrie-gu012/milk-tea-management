package com.milktea.backend.model;

import java.util.List;

public class DashboardSummary {
    private Integer todayOrders;
    private Integer revenueCents;
    private Integer lowStockItems;
    private Integer pendingOrders;
    private List<RecentOrderItem> recentOrders;
    private List<String> alerts;

    public DashboardSummary() {}

    public DashboardSummary(Integer todayOrders, Integer revenueCents, Integer lowStockItems,
                            Integer pendingOrders, List<RecentOrderItem> recentOrders, List<String> alerts) {
        this.todayOrders = todayOrders;
        this.revenueCents = revenueCents;
        this.lowStockItems = lowStockItems;
        this.pendingOrders = pendingOrders;
        this.recentOrders = recentOrders;
        this.alerts = alerts;
    }

    public Integer getTodayOrders() { return todayOrders; }
    public void setTodayOrders(Integer todayOrders) { this.todayOrders = todayOrders; }

    public Integer getRevenueCents() { return revenueCents; }
    public void setRevenueCents(Integer revenueCents) { this.revenueCents = revenueCents; }

    public Integer getLowStockItems() { return lowStockItems; }
    public void setLowStockItems(Integer lowStockItems) { this.lowStockItems = lowStockItems; }

    public Integer getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(Integer pendingOrders) { this.pendingOrders = pendingOrders; }

    public List<RecentOrderItem> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<RecentOrderItem> recentOrders) { this.recentOrders = recentOrders; }

    public List<String> getAlerts() { return alerts; }
    public void setAlerts(List<String> alerts) { this.alerts = alerts; }
}