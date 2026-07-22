import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  const getSeverity = (score) => {
    if (score > 80) return { level: "CRITICAL", color: "red" };
    if (score > 60) return { level: "HIGH", color: "orange" };
    if (score > 30) return { level: "MEDIUM", color: "yellow" };
    return { level: "LOW", color: "green" };
  };

  useEffect(() => {
    socket.on("live-transaction", (tx) => {
      const severity = getSeverity(tx.riskScore);

      setAlerts((prev) => [
        {
          ...tx,
          severity: severity.level,
          color: severity.color,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9),
      ]);
    });

    return () => socket.off("live-transaction");
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ color: "cyan" }}>Live Fraud Alerts 🚨</h3>

      {alerts.map((a, i) => (
        <div
          key={i}
          style={{
            padding: "10px",
            margin: "10px 0",
            borderLeft: `5px solid ${a.color}`,
            background: "#111827",
            borderRadius: "8px",
            color: "white",
          }}
        >
          <b>{a.severity} RISK</b> — ₹{a.amount}
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
            Risk Score: {a.riskScore} | {a.time}
          </div>
        </div>
      ))}
    </div>
  );
}