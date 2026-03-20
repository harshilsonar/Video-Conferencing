import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { serve } from "inngest/express";
import { createServer } from "http";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { initializeSocket } from "./lib/socket.js";

import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import recordingRoutes from "./routes/recordingRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { env } from "process";

const app = express();
const __dirname = path.resolve();

// ✅ Validate Required ENV Variables
if (!ENV.DB_URL) {
  console.error("❌ DB_URL is missing in environment variables");
  process.exit(1);
}

if (!ENV.PORT) {
  console.error("❌ PORT is missing in environment variables");
  process.exit(1);
}

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/sessions", sessionRoutes);
app.use("/api/sessions", recordingRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/schedule", scheduleRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// production setup
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

const startServer = async () => {
  try {
    // ✅ Connect Database First
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");

    const httpServer = createServer(app);

    initializeSocket(httpServer);
    console.log("✅ Socket.io initialized");

    httpServer.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on port ${ENV.PORT}`);
      console.log("🌐 WebRTC signaling server ready");
    });
  } catch (error) {
    console.error("💥 Error starting the server:", error.message);
    process.exit(1);
  }
};

startServer();