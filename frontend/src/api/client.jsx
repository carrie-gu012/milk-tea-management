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
  const raw = await res.text().catch(() => "");
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    // ignore parse error
  }

  const backendMsg = data?.message || data?.error || null;

  let friendlyMessage = backendMsg || `Request failed (${res.status})`;

  // ✅ Human-friendly English messages
  if (res.status === 401) {
    friendlyMessage = "Invalid username or password.";
  }

  if (res.status === 403) {
    friendlyMessage = "You do not have permission to perform this action.";
  }

  if (res.status === 404) {
    friendlyMessage = "The requested resource was not found.";
  }

  if (res.status >= 500) {
    friendlyMessage =
      "Something went wrong on our side. Please try again later.";
  }

  const err = new Error(friendlyMessage);
  err.status = res.status;
  err.data = data; // for debugging
  err.raw = raw; // for debugging

  throw err;
}
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return undefined;
  return await res.json();
}
