import { Server, Socket } from "socket.io";
import { pubClient } from "./config/redis.js";
import UserModel from "./models/user.model.js";
import { IUserLean } from "./types/type.js";

const ONLINE_USERS_SET = "online_users";

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket & { userId?: string }) => {
    socket.on("join", async (userId: string) => {
      if (!userId) return;

      socket.userId = userId;
      socket.join(userId);

      const count = await pubClient.incr(`online_user_count:${userId}`);


      await pubClient.sAdd(ONLINE_USERS_SET, userId);

      if (count === 1) {
        socket.broadcast.emit("user-online", userId);
      }

       await pubClient.sMembers(ONLINE_USERS_SET);
    });

    socket.on("get-online-users", async (requestingUserId: string) => {
      if (!requestingUserId) return;

      const user = await UserModel.findById(requestingUserId)
        .select("contacts")
        .lean<IUserLean>();

      const conatctIds = user?.contacts?.map((id) => id.toString()) || [];
      const onlineUserIds = await pubClient.sMembers(ONLINE_USERS_SET);

      const onlineContacts = conatctIds.filter((id) =>
        onlineUserIds.includes(id)
      );

      socket.emit("online-users", onlineContacts);
    });

    socket.on("disconnect", async () => {
      if (!socket.userId) return;

      const count = await pubClient.decr(`online_user_count:${socket.userId}`);


      if (count <= 0) {
        await pubClient.sRem(ONLINE_USERS_SET, socket.userId);
        socket.broadcast.emit("user-offline", socket.userId);
      }
    });
  });
}
