// src/api/inventory.jsx
import { api } from "./client.jsx";

// GET /inventory
export function getInventory() {
  return api("/inventory");
}

// POST /inventory/{ingredientId}/add  body: { delta: number }
export function addInventoryStock(ingredientId, delta) {
  return api(`/inventory/${ingredientId}/add`, {
    method: "POST",
    body: JSON.stringify({ delta }),
  });
}

// PUT /inventory/{ingredientId}  body: { quantity: number }
export function setInventoryQuantity(ingredientId, quantity) {
  return api(`/inventory/${ingredientId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}
