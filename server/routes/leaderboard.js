import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get leaderboard
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select(
        "_id email name points totalPointsEarned level achievements streakDays"
      )
      .sort({ points: -1 })
      .limit(100);

    const leaderboard = users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      points: user.points,
      totalPointsEarned: user.totalPointsEarned || 0,
      level: user.level,
      achievements: user.achievements,
      streakDays: user.streakDays || 0,
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
