import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  id: String,
  amount: Number,
  riskScore: Number,
  severity: String,
  location: String,
  type: String,
  time: String,
});

export default mongoose.model("Transaction", transactionSchema);