import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["award", "purchase", "deduct"], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  relatedId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
