import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(500);
    const formatted = transactions.map((t) => ({
      ...t.toObject(),
      userId: t.userId.toString(),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    const formatted = transactions.map((t) => ({
      ...t.toObject(),
      userId: t.userId.toString(),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
