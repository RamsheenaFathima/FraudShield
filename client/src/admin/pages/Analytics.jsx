import { useEffect, useState } from "react";
import { socket } from "../../socket";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const handler = (tx) => {
      setTransactions((prev) => [tx, ...prev.slice(0, 99)]);
    };

    socket.on("live-transaction", handler);

    return () => socket.off("live-transaction", handler);
  }, []);

  // ==========================
  // STATS
  // ==========================
  const total = transactions.length;

  const low = transactions.filter((t) => t.severity === "LOW").length;
  const medium = transactions.filter((t) => t.severity === "MEDIUM").length;
  const high = transactions.filter((t) => t.severity === "HIGH").length;
  const critical = transactions.filter((t) => t.severity === "CRITICAL").length;

  const avgRisk =
    total === 0
      ? 0
      : Math.round(
          transactions.reduce((acc, t) => acc + (t.riskScore || 0), 0) / total
        );

  const fraudPercent =
    total === 0 ? 0 : Math.round(((high + critical) / total) * 100);

  // ==========================
  // CHART DATA
  // ==========================
  const pieData = [
    { name: "LOW", value: low },
    { name: "MEDIUM", value: medium },
    { name: "HIGH", value: high },
    { name: "CRITICAL", value: critical },
  ];

  const barData = pieData;

  const lineData = transactions
    .slice(0, 20)
    .reverse()
    .map((t, index) => ({
      name: index,
      risk: t.riskScore || 0,
    }));

  const COLORS = ["#22c55e", "#facc15", "#f97316", "#ef4444"];

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1 style={{ color: "white", marginBottom: "20px" }}>Analytics 📊</h1><br></br>

      {/* ================= STATS ================= */}
      <div className="grid">
        <div className="card">
          <h3>Total Transactions</h3>
          <h1>{total}</h1>
        </div>

        <div className="card">
          <h3>Average Risk Score</h3>
          <h1>{avgRisk}</h1>
        </div>

        <div className="card">
          <h3>Fraud %</h3>
          <h1 style={{ color: "red" }}>{fraudPercent}%</h1>
        </div>
      </div>

      {/* ================= PIE CHART ================= */}
      <div style={{ width: "100%", height: 300, marginTop: 40 }}>
        <h3 style={{ color: "white" }}>Fraud Severity Distribution</h3>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= BAR CHART ================= */}
      <div style={{ width: "100%", height: 300, marginTop: 40 }}>
        <h3 style={{ color: "white" }}>Transaction Breakdown</h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#00f7ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= LINE CHART ================= */}
      <div style={{ width: "100%", height: 300, marginTop: 40 }}>
        <h3 style={{ color: "white" }}>Fraud Risk Trend 📈</h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="risk"
              stroke="#00f7ff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= SEVERITY BREAKDOWN ================= */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ color: "white" }}>Severity Breakdown</h2>

        <div className="grid">
          <div className="card">
            <h3>LOW</h3>
            <h1 style={{ color: "green" }}>{low}</h1>
          </div>

          <div className="card">
            <h3>MEDIUM</h3>
            <h1 style={{ color: "yellow" }}>{medium}</h1>
          </div>

          <div className="card">
            <h3>HIGH</h3>
            <h1 style={{ color: "orange" }}>{high}</h1>
          </div>

          <div className="card">
            <h3>CRITICAL</h3>
            <h1 style={{ color: "red" }}>{critical}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}