import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Achievement from "./models/Achievement.js";
import Reward from "./models/Reward.js";

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/gamification";

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected");

    // Clear old data
    await User.deleteMany({});
    await Achievement.deleteMany({});
    await Reward.deleteMany({});

    // Create admin
    const hashedAdminPassword = await bcrypt.hash("admin@123", 10);
    const admin = new User({
      email: "admin@gmail.com",
      password: hashedAdminPassword,
      name: "Admin",
      isAdmin: true,
    });
    await admin.save();

    // Create users
    const hashedUserPassword = await bcrypt.hash("password123", 10);
    const users = [
      {
        email: "john@example.com",
        password: hashedUserPassword,
        name: "John Doe",
        points: 450,
        level: 5,
      },
      {
        email: "sarah@example.com",
        password: hashedUserPassword,
        name: "Sarah Smith",
        points: 380,
        level: 4,
      },
      {
        email: "mike@example.com",
        password: hashedUserPassword,
        name: "Mike Johnson",
        points: 320,
        level: 4,
      },
    ];

    await User.insertMany(users);

    // Create achievements
    const achievements = [
      {
        id: "ach_1",
        title: "First Steps",
        description: "Complete your first task",
        icon: "Trophy",
        points: 50,
      },
      {
        id: "ach_2",
        title: "Team Player",
        description: "Collaborate on 5 projects",
        icon: "Users",
        points: 100,
      },
      {
        id: "ach_3",
        title: "Speed Demon",
        description: "Complete 10 tasks in one day",
        icon: "Zap",
        points: 150,
      },
    ];

    await Achievement.insertMany(achievements);

    // Create rewards
    const rewards = [
      {
        id: "rwd_1",
        name: "Extra Day Off",
        description: "One additional vacation day",
        cost: 500,
        icon: "Calendar",
        stock: 10,
      },
      {
        id: "rwd_2",
        name: "Gift Card $50",
        description: "Amazon gift card worth $50",
        cost: 300,
        icon: "Gift",
        stock: 20,
      },
      {
        id: "rwd_3",
        name: "Free Lunch",
        description: "Free lunch for a week",
        cost: 200,
        icon: "Coffee",
        stock: 30,
      },
    ];

    await Reward.insertMany(rewards);

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
