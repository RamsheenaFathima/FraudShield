import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    socket.on("live-transaction", (tx) => {
      setTransactions((prev) => [tx, ...prev.slice(0, 19)]);
    });

    return () => socket.off("live-transaction");
  }, []);
    const filteredTransactions = transactions.filter((tx) => {
  if (filter === "ALL") return true;

  return (tx.severity || "LOW") === filter;
});
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1 style={{ color: "white" }}>Live Transactions 📊</h1>
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
  
  <button className="btn" onClick={() => setFilter("ALL")}>
    ALL
  </button>

  <button className="btn" onClick={() => setFilter("LOW")}>
    LOW
  </button>

  <button className="btn" onClick={() => setFilter("MEDIUM")}>
    MEDIUM
  </button>

  <button className="btn" onClick={() => setFilter("HIGH")}>
    HIGH
  </button>

  <button className="btn" onClick={() => setFilter("CRITICAL")}>
    CRITICAL
  </button>

</div>

      <div className="table-container">
      <table style={{
        width: "100%",
        marginTop: "20px",
        borderCollapse: "collapse",
        background: "#111827",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        
        <thead>
          <tr style={{ textAlign: "left", background: "#0f172a" }}>
            <th style={th}>ID</th>
            <th style={th}>Amount</th>
            <th style={th}>Risk Score</th>
            <th style={th}>Severity</th>
            <th style={th}>Type</th>
            <th style={th}>Location</th>
            <th style={th}>Time</th>
          </tr>
        </thead>

        <tbody>
          {filteredTransactions.map((tx, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #1f2937" }}>
              <td style={td}>{tx.id}</td>
              <td style={td}>₹{tx.amount}</td>

              <td style={td}>
                <span style={{
                  color: tx.riskScore > 80 ? "red" :
                         tx.riskScore > 60 ? "orange" : "#00f7ff"
                }}>
                  {tx.riskScore}
                </span>
              </td>

              <td style={td}>
                <span style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background:
                    tx.severity === "CRITICAL" ? "#ff0000" :
                    tx.severity === "HIGH" ? "#ff4d4d" :
                    tx.severity === "MEDIUM" ? "#facc15" : "#22c55e",
                  color: "black",
                  fontWeight: "bold"
                }}>
                  {tx.severity || "LOW"}
                </span>
              </td>

              <td style={td}>{tx.type}</td>
              <td style={td}>{tx.location}</td>
              <td style={td}>{tx.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// styles
const th = {
  padding: "12px",
  color: "#00f7ff",
  borderBottom: "1px solid #1f2937"
};

const td = {
  padding: "12px",
  fontSize: "14px"
};