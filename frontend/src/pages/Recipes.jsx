import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:8080";

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
            fetch(`${API}/products/${p.productId}`).then((r) => r.json()),
          ),
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
          : true,
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
    <div className="container">
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div>
            <h1 className="h1" style={{ marginBottom: 6 }}>
              Recipes
            </h1>
            <p className="sub" style={{ margin: 0 }}>
              View product recipes and ingredient usage in one place.
            </p>
          </div>

          <div
            className="pill"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "var(--text)",
              fontWeight: 600,
            }}
          >
            {rows.length} recipe{rows.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
          />

          <label
            className="pill"
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Active only
          </label>
        </div>
      </div>

      {loading ? (
        <div className="card card-pad">
          <div className="sub" style={{ margin: 0 }}>
            Loading recipes...
          </div>
        </div>
      ) : rows.length === 0 ? (
        <div className="card card-pad">
          <div className="sub" style={{ margin: 0 }}>
            No recipes found.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {rows.map((r) => (
            <div key={r.productId} className="card card-pad">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 2fr) auto",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 16,
                      color: "var(--text)",
                      marginBottom: 6,
                    }}
                  >
                    {r.name}
                  </div>

                  <div
                    className="pill"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: r.isActive
                        ? "rgba(50, 196, 141, 0.14)"
                        : "rgba(255, 91, 138, 0.14)",
                      color: r.isActive ? "#15803d" : "#be185d",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {r.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {makeSummary(r.recipe)}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    className={open[r.productId] ? "btn" : "btn btn-primary"}
                    onClick={() => toggleOpen(r.productId)}
                  >
                    {open[r.productId] ? "Hide" : "View"}
                  </button>
                </div>
              </div>

              {open[r.productId] && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 14,
                    borderTop: "1px solid var(--border)",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  {(r.recipe || []).length === 0 ? (
                    <div className="sub" style={{ margin: 0 }}>
                      No recipe lines.
                    </div>
                  ) : (
                    (r.recipe || []).map((line) => (
                      <div
                        key={line.ingredientId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          border: "1px solid var(--border)",
                          borderRadius: 14,
                          background: "rgba(251,251,253,0.85)",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>
                          {line.ingredientName}
                        </div>
                        <div className="pill">
                          {line.qtyRequired}
                          {line.unit}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
