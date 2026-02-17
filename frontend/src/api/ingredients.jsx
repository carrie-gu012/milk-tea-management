// src/api/ingredients.jsx
import { api } from "./client.jsx";

// 创建 ingredient（建议后端：同时在 inventory 建一行 quantity，初始为 0 或传入 initialQuantity）
export function createIngredient({
  ingredientName,
  unit,
  initialQuantity = 0,
}) {
  return api("/ingredients", {
    method: "POST",
    body: JSON.stringify({ ingredientName, unit, initialQuantity }),
  });
}

// 编辑 ingredient（只改 name/unit）
export function updateIngredient(ingredientId, { ingredientName, unit }) {
  return api(`/ingredients/${ingredientId}`, {
    method: "PUT",
    body: JSON.stringify({ ingredientName, unit }),
  });
}

// 删除 ingredient
export function deleteIngredient(ingredientId) {
  return api(`/ingredients/${ingredientId}`, { method: "DELETE" });
}
