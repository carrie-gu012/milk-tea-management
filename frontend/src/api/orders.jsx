// src/api/orders.jsx
import { api } from "./client.jsx";

export async function createOrder(createdBy) {
  return api("/orders", {
    method: "POST",
    body: JSON.stringify({ createdBy: createdBy || "UNKNOWN" }),
  });
}

export function addOrderItem(orderId, { productId, quantity }) {
  return api(`/orders/${orderId}/items`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function completeOrder(orderId) {
  return api(`/orders/${orderId}/complete`, { method: "POST" });
}

export function getOrderDetail(orderId) {
  return api(`/orders/${orderId}`);
}

export async function removeOrderItem(orderId, productId) {
  return await api(`/orders/${orderId}/items/${productId}`, {
    method: "DELETE",
  });
}


// status 可传 "CREATED"/"COMPLETED" 或者 null
export function listOrders({ status = null, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  return api(`/orders?${params.toString()}`);
}
