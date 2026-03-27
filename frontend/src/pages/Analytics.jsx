import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";
import { getTopProducts, getDailySales, getMostConsumed, getLowStock } from "../api/analytics.jsx";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF'];

// Helper to format cents to dollars
const formatMoney = (cents) => `$${(cents / 100).toFixed(2)}`;

export default function Analytics() {
    const [topProducts, setTopProducts] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [ingredientUsage, setIngredientUsage] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [top, daily, usage, stock] = await Promise.all([
                    getTopProducts(),
                    getDailySales(),
                    getMostConsumed(),
                    getLowStock()
                ]);
                setTopProducts(top);
                setDailySales(daily);
                setIngredientUsage(usage);
                setLowStock(stock);
                setError(null);
            } catch (err) {
                console.error("Failed to load analytics", err);
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="card card-pad" style={{ textAlign: "center" }}>
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card card-pad" style={{ color: "#b91c1c", borderColor: "#b91c1c" }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="analytics-container" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div className="card card-pad">
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Analytics Dashboard</h2>
                <p style={{ marginTop: 6, color: "var(--muted)" }}>
                    Data insights for sales, product performance, and ingredient usage.
                </p>
            </div>

            {/* Top Products - Bar Chart */}
            <div className="card card-pad">
                <h3 style={{ marginTop: 0 }}>Top 5 Best Selling Products</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="productName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalQuantitySold" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Daily Sales - Line Chart */}
            <div className="card card-pad">
                <h3 style={{ marginTop: 0 }}>Daily Sales (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailySales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="saleDate" />
                        <YAxis tickFormatter={(value) => formatMoney(value)} />
                        <Tooltip formatter={(value) => formatMoney(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="totalCents" stroke="#82ca9d" name="Sales ($)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Most Consumed Ingredients - Pie Chart */}
            <div className="card card-pad">
                <h3 style={{ marginTop: 0 }}>Most Consumed Ingredients</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={ingredientUsage}
                            dataKey="totalQuantityUsed"
                            nameKey="ingredientName"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {ingredientUsage.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Low Stock Alerts - Table */}
            <div className="card card-pad">
                <h3 style={{ marginTop: 0 }}>Low Stock Alerts (Threshold = 500)</h3>
                {lowStock.length === 0 ? (
                    <p>All ingredients are above threshold.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid var(--border)" }}>Ingredient</th>
                                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid var(--border)" }}>Current Quantity</th>
                                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid var(--border)" }}>Threshold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStock.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--border)" }}>{item.ingredientName}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--border)" }}>{item.currentQuantity}</td>
                                        <td style={{ padding: "8px", borderBottom: "1px solid var(--border)" }}>{item.threshold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}