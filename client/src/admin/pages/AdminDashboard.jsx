import Alerts from "../components/Alerts";
import Heatmap from "../components/Heatmap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import AlertSidebar from "../components/AlertSidebar";
import { FaShieldAlt } from "react-icons/fa";
export default function AdminDashboard() {

  // 📄 PDF EXPORT FUNCTION
  const exportPDF = () => {
    const input = document.getElementById("dashboard");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;

      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("fraud-dashboard-report.pdf");
    });
  };

  return (
    <div id="dashboard" style={{ padding: "20px", color: "white" }}>

      {/* HEADER */}
      <h1
  style={{
    color: "white",
    fontSize: "52px",
    marginTop: "10px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
  }}
>
  <FaShieldAlt color="#00f7ff" />
  FraudShield
</h1>
<p style={{ justifyContent: "center" }}>Real-Time Fraud Risk Monitoring System</p><br></br>

      {/* EXPORT BUTTON */}
<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
  <button
    onClick={exportPDF}
    className="btn"
  >
    📄 Export PDF Report
  </button>
</div>

      {/* STATS CARDS */}
      <div className="grid">
        <div className="card">
          <h3>Total Transactions</h3>
          <h1>12,450</h1>
          <p style={{ color: "#94a3b8" }}>Today processed</p>
        </div>

        <div className="card">
          <h3>Fraud Alerts</h3>
          <h1 style={{ color: "#ff4d4d" }}>87</h1>
          <p style={{ color: "#94a3b8" }}>High risk detected</p>
        </div>

        <div className="card">
          <h3>Risk Score Avg</h3>
          <h1 style={{ color: "#00f7ff" }}>68%</h1>
          <p style={{ color: "#94a3b8" }}>System-wide risk</p>
        </div>

        <div className="card">
          <h3>Blocked Transactions</h3>
          <h1>34</h1>
          <p>Auto prevented fraud</p>
        </div>
      </div>

      {/* LIVE FEED SECTION */}
      <div style={{
        marginTop: "30px",
        padding: "20px",
        background: "#111827",
        borderRadius: "12px",
        border: "1px solid rgba(0,247,255,0.2)"
      }}>
        <h2 style={{ color: "white" }}>Live Transaction Feed</h2>

        <p style={{ color: "#94a3b8" }}>
          Waiting for real-time data from backend...
        </p>

        {/* ALERTS */}
        <AlertSidebar />

        {/* HEATMAP */}
        <Heatmap />
      </div>

    </div>
  );
}