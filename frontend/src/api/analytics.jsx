// src/api/analytics.jsx
import { api } from "./client.jsx";

export async function getTopProducts() {
    return api("/analytics/top-products");
}

export async function getDailySales() {
    return api("/analytics/daily-sales");
}

export async function getMostConsumed() {
    return api("/analytics/most-consumed");
}

export async function getLowStock() {
    return api("/analytics/low-stock");
}