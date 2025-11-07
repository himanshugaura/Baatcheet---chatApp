import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnect from "./config/database.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import chatRouter from "./routes/chat.routes.js";
import passport from "passport";
import authRouter from "./routes/auth.routes.js";
import { setupSocket } from "./socket.js";

async function startServer() {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 3030;
  const whitelist = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"];

  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());

  // DB + Redis
  await dbConnect();

  // Passport only for Google login (stateless)
  app.use(passport.initialize());

  // Production CORS setup
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  // Create server & attach Socket.IO
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: whitelist,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  setupSocket(io);
  app.set("io", io);

  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });


  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/chat", chatRouter);

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
