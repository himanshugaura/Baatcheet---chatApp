import { Server, Socket } from "socket.io";
import { pubClient } from "./config/redis";

const ONLINE_USERS_SET = "online_users";

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket & { userId?: string }) => {
    socket.on("join", async (userId: string) => {
      if (!userId) return;
      socket.userId = userId;
      socket.join(userId);

      const count = await pubClient.incr(`online_user_count:${userId}`);
      if (count === 1) {
        await pubClient.sAdd(ONLINE_USERS_SET, userId);
        socket.broadcast.emit("user-online", userId);
      }
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        const count = await pubClient.decr(
          `online_user_count:${socket.userId}`
        );
        if (count <= 0) {
          await pubClient.sRem(ONLINE_USERS_SET, socket.userId);
          socket.broadcast.emit("user-offline", socket.userId);
        }
      }
    });
  });
}
