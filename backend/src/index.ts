import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import dbConnect from './config/database';
import userRouter from './routes/user.routes';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import http from 'http';
import chatRouter from './routes/chat.routes';
import Onlinerouter from './routes/onlineStatus.routes';
import { connectRedis , pubClient } from './config/redis';
import  session  from 'express-session';
import passport from 'passport';
import authRouter from './routes/auth.routes';
import { setupSocket } from './socket';

async function startServer() {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 3030;
  const whitelist = process.env.CORS_ORIGIN || "http://localhost:3000";

  app.use(cookieParser());
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  await dbConnect();
  await connectRedis();

  app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

  app.use(
    cors({
      origin: whitelist,
      methods: ['GET', 'POST'],
      credentials: true,
    })
  );

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: whitelist,
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  setupSocket(io);
  app.set("io", io);

  await pubClient.del("online_users");
const keys = await pubClient.keys("online_user_count:*");
if (keys.length) await pubClient.del(keys);

console.log("✅ Redis online user keys cleared")

  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/online", Onlinerouter);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
