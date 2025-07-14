import { Server, Socket } from "socket.io";
import { pubClient } from "./config/redis.js";
import UserModel from "./models/user.model.js";
import { IUserLean } from "./types/type.js";

const ONLINE_USERS_SET = "online_users";

const userSocketMap = new Map<string, Set<string>>();

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket & { userId?: string }) => {

    socket.on("join", async (userId: string) => {
      if (!userId) return;

      socket.userId = userId;
      socket.join(userId);

      let sockets = userSocketMap.get(userId);
      if (!sockets) {
        sockets = new Set();
        userSocketMap.set(userId, sockets);
      }
      sockets.add(socket.id);

      if (sockets.size === 1) {
        await pubClient.sAdd(ONLINE_USERS_SET, userId);
        socket.broadcast.emit("user-online", userId);
      }

      const online = await pubClient.sMembers(ONLINE_USERS_SET);
    });

    socket.on("disconnect", async () => {
      const userId = socket.userId;
      if (!userId) return;

      const sockets = userSocketMap.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSocketMap.delete(userId);
          await pubClient.sRem(ONLINE_USERS_SET, userId);
          socket.broadcast.emit("user-offline", userId);
        }
      }

      const online = await pubClient.sMembers(ONLINE_USERS_SET);
    });

    socket.on("get-online-users", async (requestingUserId: string) => {
      if (!requestingUserId) return;

      const user = await UserModel.findById(requestingUserId)
        .select("contacts")
        .lean<IUserLean>();

      const contactIds = user?.contacts?.map((id) => id.toString()) || [];
      const onlineUserIds = await pubClient.sMembers(ONLINE_USERS_SET);

      const onlineContacts = contactIds.filter((id) =>
        onlineUserIds.includes(id)
      );

      socket.emit("online-users", onlineContacts);
    });
  });
}
