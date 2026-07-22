import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import "leaflet/dist/leaflet.css";

export default function Heatmap() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const handleTransaction = (tx) => {
      // Fake geo locations (India centered)
      const lat = 19.076 + (Math.random() - 0.5) * 6;
      const lng = 72.8777 + (Math.random() - 0.5) * 6;

      setPoints((prev) => [
        ...prev.slice(-40),
        {
          lat,
          lng,
          risk: tx.riskScore || 0,
        },
      ]);
    };

    socket.on("live-transaction", handleTransaction);

    return () => {
      socket.off("live-transaction", handleTransaction);
    };
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ color: "white" }}>Fraud Heatmap 🌡️</h2>

      <div
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[19.076, 72.8777]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {points.map((p, i) => (
            <CircleMarker
              key={i}
              center={[p.lat, p.lng]}
              radius={Math.max(p.risk / 10, 5)}
              pathOptions={{
                color: p.risk > 70 ? "red" : "cyan",
                fillOpacity: 0.5,
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}