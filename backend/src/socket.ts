import { Server, Socket } from 'socket.io';
import { pubClient } from './config/redis';

const ONLINE_USERS_SET = "online_users";

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket & { userId?: string }) => {

    socket.on("join", async (userId: string) => {
      if (!userId) return;
      socket.userId = userId;
      socket.join(userId);

      await pubClient.sAdd(ONLINE_USERS_SET, userId);
      socket.broadcast.emit("user-online", userId);
    });

    socket.on("send-message", (msg: { receiverId: string; [key: string]: any }) => {
      const { receiverId } = msg;
      if (!receiverId) return;
      io.to(receiverId).emit("receive-message", msg);
    });

    socket.on("get-online-users", async () => {
      const onlineUsers = await pubClient.sMembers(ONLINE_USERS_SET);
      socket.emit("online-users", onlineUsers);
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        await pubClient.sRem(ONLINE_USERS_SET, socket.userId);
        socket.broadcast.emit("user-offline", socket.userId);
      }
    });
  });
}
