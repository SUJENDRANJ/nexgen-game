import express from "express";
import Reward, { Redemption } from "../models/Reward.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all active rewards
router.get("/", async (req, res) => {
  try {
    const rewards = await Reward.find({ isActive: true });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new reward
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, cost, icon, stock, imageUrl, category } =
      req.body;

    const rewardId = `rwd_${Date.now()}`;
    const reward = new Reward({
      id: rewardId,
      name,
      description,
      cost,
      icon,
      imageUrl,
      category: category || "perks",
      stock: stock || 999,
    });

    await reward.save();

    req.app.get("io").emit("rewardCreated", reward);

    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Purchase a reward
router.post("/purchase/:rewardId", authMiddleware, async (req, res) => {
  try {
    const { rewardId } = req.params;
    const userId = req.userId; // from authMiddleware

    const user = await User.findById(userId);
    const reward = await Reward.findOne({ id: rewardId });

    if (!user || !reward) {
      return res.status(404).json({ message: "User or reward not found" });
    }

    if (user.points < reward.cost) {
      return res.status(400).json({ message: "Insufficient points" });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    user.points -= reward.cost;
    user.rewardsPurchased.push(rewardId);
    reward.stock -= 1;

    await user.save();
    await reward.save();

    const transaction = new Transaction({
      userId: user._id,
      type: "purchase",
      amount: -reward.cost,
      description: `Redeemed: ${reward.name}`,
      relatedId: rewardId,
    });
    await transaction.save();

    const redemption = new Redemption({
      id: `red_${Date.now()}_${user._id}`,
      userId: user._id,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsSpent: reward.cost,
      status: "pending",
    });
    await redemption.save();

    const populatedRedemption = await Redemption.findById(
      redemption._id
    ).populate("userId", "name email");

    req.app.get("io").emit("rewardPurchased", {
      userId: user._id,
      rewardId,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        points: user.points,
        totalPointsEarned: user.totalPointsEarned || 0,
        level: user.level,
        rewardsPurchased: user.rewardsPurchased,
      },
    });

    req.app.get("io").emit("redemptionCreated", {
      id: populatedRedemption.id,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsSpent: reward.cost,
      status: populatedRedemption.status,
      redeemedAt: populatedRedemption.redeemedAt,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all redemptions
router.get("/redemptions", authMiddleware, async (req, res) => {
  try {
    const redemptions = await Redemption.find()
      .populate("userId", "name email")
      .sort({ redeemedAt: -1 });

    const mappedRedemptions = redemptions.map((r) => ({
      id: r.id,
      userId: r.userId._id,
      userName: r.userId.name,
      userEmail: r.userId.email,
      rewardId: r.rewardId,
      rewardName: r.rewardName,
      pointsSpent: r.pointsSpent,
      status: r.status,
      redeemedAt: r.redeemedAt,
      fulfilledAt: r.fulfilledAt,
      notes: r.notes,
    }));

    res.json(mappedRedemptions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update redemption status
router.patch("/redemptions/:id", authMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const redemptionId = req.params.id;

    const updateData = { status, notes };
    if (status === "fulfilled" || status === "rejected") {
      updateData.fulfilledAt = new Date();
      updateData.fulfilledBy = req.userId;
    }

    const redemption = await Redemption.findOneAndUpdate(
      { id: redemptionId },
      updateData,
      { new: true }
    ).populate("userId", "name email");

    if (!redemption) {
      return res.status(404).json({ message: "Redemption not found" });
    }

    req.app.get("io").emit("redemptionUpdated", {
      id: redemption.id,
      userId: redemption.userId._id,
      userName: redemption.userId.name,
      userEmail: redemption.userId.email,
      rewardId: redemption.rewardId,
      rewardName: redemption.rewardName,
      pointsSpent: redemption.pointsSpent,
      status: redemption.status,
      redeemedAt: redemption.redeemedAt,
      fulfilledAt: redemption.fulfilledAt,
      notes: redemption.notes,
    });

    res.json(redemption);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Soft delete a reward
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Reward.findOneAndUpdate({ id: req.params.id }, { isActive: false });

    req.app.get("io").emit("rewardDeleted", req.params.id);

    res.json({ message: "Reward deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
