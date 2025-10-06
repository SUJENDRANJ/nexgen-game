import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  icon: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, default: "perks" },
  isActive: { type: Boolean, default: true },
  stock: { type: Number, default: 999 },
  createdAt: { type: Date, default: Date.now },
});

const RedemptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rewardId: { type: String, required: true },
  rewardName: { type: String, required: true },
  pointsSpent: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "fulfilled", "rejected"],
    default: "pending",
  },
  redeemedAt: { type: Date, default: Date.now },
  fulfilledAt: { type: Date },
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: { type: String },
});

export const Reward = mongoose.model("Reward", RewardSchema);
export const Redemption = mongoose.model("Redemption", RedemptionSchema);

export default Reward;
