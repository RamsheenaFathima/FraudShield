import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function AlertSidebar() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const handler = (alert) => {
      setAlerts((prev) => [alert, ...prev.slice(0, 9)]);

      // ==========================
      // 🔊 SOUND ALERT (CRITICAL ONLY)
      // ==========================
      if (alert.severity === "CRITICAL") {
        const audio = new Audio("/sounds/alert.mp3");
        audio.play();
      }
    };

    socket.on("fraud-alert", handler);

    return () => socket.off("fraud-alert", handler);
  }, []);

  return (
    <div
      style={{
        width: "300px",
        background: "#0f172a",
        padding: "15px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.1)",
        height: "400px",
        overflowY: "auto",
      }}
    >
      <h3 style={{ color: "#00f7ff" }}>🚨 Live Alerts</h3>

      {alerts.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No alerts yet...</p>
      ) : (
        alerts.map((a, i) => (
          <div
            key={i}
            style={{
              background:
                a.severity === "CRITICAL" ? "#ff000020" : "#ff980020",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "8px",
              borderLeft:
                a.severity === "CRITICAL"
                  ? "4px solid red"
                  : "4px solid orange",
            }}
          >
            <b style={{ color: "white" }}>{a.severity}</b>
            <p style={{ fontSize: "12px", color: "#ccc" }}>
              {a.message}
            </p>
          </div>
        ))
      )}
    </div>
  );
}