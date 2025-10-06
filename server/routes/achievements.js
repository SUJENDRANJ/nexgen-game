import express from "express";
import Achievement from "../models/Achievement.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all active achievements
router.get("/", async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all user achievements (for admins)
router.get("/all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    const allUserAchievements = [];

    users.forEach((user) => {
      user.achievements.forEach((achievementId) => {
        allUserAchievements.push({
          userId: user._id.toString(),
          achievementId: achievementId.toString
            ? achievementId.toString()
            : achievementId,
        });
      });
    });

    res.json(allUserAchievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user achievements
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userAchievements = user.achievements.map((achievementId) => ({
      userId: user._id.toString(),
      achievementId,
    }));

    res.json(userAchievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new achievement
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, icon, points, category, rarity } = req.body;

    const achievementId = `ach_${Date.now()}`;
    const achievement = new Achievement({
      id: achievementId,
      title,
      description,
      icon,
      points,
      category: category || "milestone",
      rarity: rarity || "common",
    });

    await achievement.save();

    // Emit via Socket.IO
    req.app.get("io").emit("achievementCreated", achievement);

    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Award an achievement to a user
router.post("/award/:achievementId", authMiddleware, async (req, res) => {
  try {
    const { achievementId } = req.params;
    const { userId } = req.body;

    const user = await User.findById(userId);
    const achievement = await Achievement.findOne({ id: achievementId });

    if (!user || !achievement) {
      return res.status(404).json({ message: "User or achievement not found" });
    }

    if (user.achievements.includes(achievementId)) {
      return res.status(400).json({ message: "Achievement already awarded" });
    }

    user.achievements.push(achievementId);
    user.points += achievement.points;
    user.totalPointsEarned += achievement.points;
    user.level = Math.floor(user.totalPointsEarned / 100) + 1;

    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: "award",
      amount: achievement.points,
      description: `Achievement unlocked: ${achievement.title}`,
      relatedId: achievementId,
    });
    await transaction.save();

    req.app.get("io").emit("achievementAwarded", {
      userId: user._id,
      achievementId,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        totalPointsEarned: user.totalPointsEarned,
        level: user.level,
        achievements: user.achievements,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Soft delete an achievement
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Achievement.findOneAndUpdate(
      { id: req.params.id },
      { isActive: false }
    );

    req.app.get("io").emit("achievementDeleted", req.params.id);

    res.json({ message: "Achievement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
