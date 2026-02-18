// src/api/ingredients.jsx
import { api } from "./client.jsx";

// ✅ 获取所有 ingredients（带 type），给 recipe editor 下拉用
export function listIngredients() {
  return api("/ingredients");
}

// ✅ 创建 ingredient（需要 type）
export function createIngredient({
  ingredientName,
  unit,
  type,
  initialQuantity = 0,
}) {
  return api("/ingredients", {
    method: "POST",
    body: JSON.stringify({ ingredientName, unit, type, initialQuantity }),
  });
}

// ✅ 编辑 ingredient（现在也允许改 type）
export function updateIngredient(ingredientId, { ingredientName, unit, type }) {
  return api(`/ingredients/${ingredientId}`, {
    method: "PUT",
    body: JSON.stringify({ ingredientName, unit, type }),
  });
}

// 删除 ingredient
export function deleteIngredient(ingredientId) {
  return api(`/ingredients/${ingredientId}`, { method: "DELETE" });
}
