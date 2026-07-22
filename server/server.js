
import { connectDB } from "./db.js";
import Transaction from "./models/Transaction.js";

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Store recent transactions for frequency calculation
let recentTransactions = [];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ==========================
// TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("Fraud Dashboard API Running 🚀");
});

// ==========================
// REAL-TIME FRAUD STREAM
// ==========================
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const interval = setInterval(async () => {
    const now = Date.now();

    const tx = {
      id: now.toString(),

      // Random amount between 0 and 100000
      amount: Math.floor(Math.random() * 100000),

      // Location
      location: Math.random() > 0.5 ? "India" : "Foreign",

      // Transaction type
      type: ["UPI", "Card", "NetBanking", "Wallet"][
        Math.floor(Math.random() * 4)
      ],

      time: new Date().toLocaleTimeString(),
    };

    // ==========================
    // RISK SCORE ENGINE
    // Amount + Location + Frequency
    // ==========================
    let riskScore = 0;

    // Amount Risk
    if (tx.amount > 75000) {
      riskScore += 40;
    } else if (tx.amount > 50000) {
      riskScore += 25;
    } else if (tx.amount > 20000) {
      riskScore += 10;
    }

    // Location Risk
    if (tx.location === "Foreign") {
      riskScore += 30;
    }

    // Frequency Risk
    recentTransactions = recentTransactions.filter(
      (t) => now - t.timestamp < 20000
    );

    const frequency = recentTransactions.length;

    if (frequency >= 5) {
      riskScore += 15;
    }

    if (frequency >= 10) {
      riskScore += 30;
    }

    // Store current transaction timestamp
    recentTransactions.push({
      timestamp: now,
    });

    // Cap score at 100
    riskScore = Math.min(riskScore, 100);

    tx.riskScore = riskScore;

    // ==========================
    // SEVERITY ENGINE
    // ==========================
    let severity = "LOW";
    let color = "green";

    if (riskScore > 80) {
      severity = "CRITICAL";
      color = "red";
    } else if (riskScore > 60) {
      severity = "HIGH";
      color = "orange";
    } else if (riskScore > 40) {
      severity = "MEDIUM";
      color = "yellow";
    }

    const enrichedTx = {
      ...tx,
      severity,
      color,
      frequency,
    };

    // ==========================
    // SAVE TO MONGODB
    // ==========================
    try {
      await Transaction.create(enrichedTx);
    } catch (err) {
      console.log("Mongo Save Error:", err.message);
    }

    // ==========================
    // LIVE STREAM
    // ==========================
    socket.emit("live-transaction", enrichedTx);

    // ==========================
    // ALERT STREAM
    // ==========================
    if (severity === "HIGH" || severity === "CRITICAL") {
      socket.emit("fraud-alert", {
        id: enrichedTx.id,
        severity,
        message: `${severity} Risk Transaction Detected`,
        transaction: enrichedTx,
        color,
      });
    }
  }, 2000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected:", socket.id);
  });
});

// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
};

startServer();

