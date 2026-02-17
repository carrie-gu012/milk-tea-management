// src/api/client.jsx
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",

      // ✅ 最小权限方案：把当前登录用户信息带给后端
      ...(role ? { "X-ROLE": role } : {}),
      ...(username ? { "X-USER": username } : {}),

      // ✅ 如果你后端未来用 Authorization，这里也预留
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return undefined;
  return await res.json();
}
