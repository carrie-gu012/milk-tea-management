// src/api/products.jsx
import { api } from "./client.jsx";

export function getProducts() {
  return api("/products");
}
