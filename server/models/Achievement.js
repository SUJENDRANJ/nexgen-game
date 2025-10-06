import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  points: { type: Number, required: true },
  category: { type: String, required: true, default: "milestone" },
  rarity: { type: String, required: true, default: "common" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Achievement", AchievementSchema);
