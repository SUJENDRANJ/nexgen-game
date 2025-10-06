import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import achievementsRoutes from "./routes/achievements.js";
import rewardsRoutes from "./routes/rewards.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import usersRoutes from "./routes/users.js";
import transactionsRoutes from "./routes/transactions.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Attach socket.io to app
app.set("io", io);

// Connect database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/transactions", transactionsRoutes);

// Socket.io setup
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
