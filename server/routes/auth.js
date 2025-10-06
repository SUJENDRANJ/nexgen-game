import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = email === "admin@gmail.com";

    const user = new User({
      email,
      password: hashedPassword,
      name,
      isAdmin,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        totalPointsEarned: user.totalPointsEarned || 0,
        level: user.level,
        isAdmin: user.isAdmin,
        achievements: user.achievements,
        rewardsPurchased: user.rewardsPurchased,
        streakDays: user.streakDays || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const now = new Date();
    const lastLogin = user.lastLoginDate;

    if (lastLogin) {
      const lastLoginDay = new Date(lastLogin).setHours(0, 0, 0, 0);
      const todayStart = new Date(now).setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (todayStart - lastLoginDay) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        user.streakDays += 1;
      } else if (daysDiff > 1) {
        user.streakDays = 1;
      }
    } else {
      user.streakDays = 1;
    }

    user.lastLoginDate = now;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        totalPointsEarned: user.totalPointsEarned || 0,
        level: user.level,
        isAdmin: user.isAdmin,
        achievements: user.achievements,
        rewardsPurchased: user.rewardsPurchased,
        streakDays: user.streakDays,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
