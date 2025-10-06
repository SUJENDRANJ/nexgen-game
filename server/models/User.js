import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  points: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  isAdmin: { type: Boolean, default: false },
  achievements: [{ type: String }],
  rewardsPurchased: [{ type: String }],
  streakDays: { type: Number, default: 0 },
  lastLoginDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
