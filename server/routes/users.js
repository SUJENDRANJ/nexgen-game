import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/award-points", authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { userId, points, description } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.points += points;
    if (user.points < 0) user.points = 0;
    if (points > 0) {
      user.totalPointsEarned += points;
    }
    user.level = Math.floor(user.totalPointsEarned / 100) + 1;

    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: points > 0 ? "award" : "deduct",
      amount: points,
      description:
        description || (points > 0 ? "Points awarded" : "Points deducted"),
    });
    await transaction.save();

    req.app.get("io").emit("pointsAwarded", {
      userId: user._id,
      points,
      description,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        totalPointsEarned: user.totalPointsEarned,
        level: user.level,
      },
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        totalPointsEarned: user.totalPointsEarned,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("Award points error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId", authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await User.findByIdAndDelete(userId);

    req.app.get("io").emit("userDeleted", userId);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
