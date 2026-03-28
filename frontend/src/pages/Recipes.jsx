import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:8080";
const BUILD_TAG = "RECIPES_BUILD_2026-02-23_1537";

export default function Recipes() {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);
  const [open, setOpen] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const products = await fetch(`${API}/products`).then((r) => r.json());
        const detailList = await Promise.all(
          (products || []).map((p) =>
            fetch(`${API}/products/${p.productId}`).then((r) => r.json())
          )
        );
        setDetails(detailList);
      } catch (e) {
        console.error(e);
        setDetails([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows = useMemo(() => {
    const base = (details || []).map((d) => ({
      productId: d.productId,
      name: d.name,
      isActive: !!d.isActive,
      recipe: d.recipe || [],
    }));

    return base
      .filter((r) => (onlyActive ? r.isActive : true))
      .filter((r) =>
        search.trim()
          ? String(r.name).toLowerCase().includes(search.trim().toLowerCase())
          : true
      );
  }, [details, search, onlyActive]);

  function toggleOpen(productId) {
    setOpen((prev) => ({ ...prev, [productId]: !prev[productId] }));
  }

  function makeSummary(recipe) {
    if (!recipe || recipe.length === 0) return "No recipe";
    const first = recipe[0];
    const qty = `${first.qtyRequired}${first.unit || ""}`;
    return `${first.ingredientName}, ${qty} (${recipe.length} items)`;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Recipes</h1>
      <div style={{ fontSize: 12, color: "#d00", marginBottom: 12 }}>
        Build: {BUILD_TAG}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search recipes..."
          style={{ flex: 1, padding: "10px 12px" }}
        />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
          />
          Active only
        </label>
      </div>

      {!loading &&
        rows.map((r) => (
          <div key={r.productId} style={{ borderTop: "1px solid #eee", padding: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr 120px" }}>
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div style={{ color: "#666" }}>{makeSummary(r.recipe)}</div>
              <div style={{ textAlign: "right" }}>
                <button onClick={() => toggleOpen(r.productId)}>
                  {open[r.productId] ? "Hide" : "View"}
                </button>
              </div>
            </div>

            {open[r.productId] && (
              <div style={{ marginTop: 10 }}>
                {(r.recipe || []).map((line) => (
                  <div key={line.ingredientId}>
                    {line.ingredientName}: {line.qtyRequired}
                    {line.unit}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}