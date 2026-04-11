import { api } from "./client.jsx";

export async function getDashboardSummary() {
  return api("/dashboard/summary");
}
