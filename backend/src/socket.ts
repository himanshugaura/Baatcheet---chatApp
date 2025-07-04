import { Server, Socket } from "socket.io";
import { pubClient } from "./config/redis";
import UserModel from "./models/user.model";
import { IUserLean } from "./types/type";

const ONLINE_USERS_SET = "online_users";

export function setupSocket(io: Server) {
  io.on("connection", (socket: Socket & { userId?: string }) => {
    socket.on("join", async (userId: string) => {
      console.log("[JOIN] Received:", userId);
      if (!userId) return;

      socket.userId = userId;
      socket.join(userId);

      const count = await pubClient.incr(`online_user_count:${userId}`);

      await pubClient.expire(`online_user_count:${userId}`, 60); 

      await pubClient.sAdd(ONLINE_USERS_SET, userId);

      if (count === 1) {
        socket.broadcast.emit("user-online", userId);
        console.log(`[JOIN] Broadcasted user-online: ${userId}`);
      }

      const allOnline = await pubClient.sMembers(ONLINE_USERS_SET);
      console.log(`[JOIN] Online Users SET:`, allOnline);
    });

    socket.on("get-online-users", async (requestingUserId: string) => {
      if (!requestingUserId) return;

      const user = await UserModel.findById(requestingUserId)
        .select("following")
        .lean<IUserLean>();

      const followingIds = user?.following?.map((id) => id.toString()) || [];
      const onlineUserIds = await pubClient.sMembers(ONLINE_USERS_SET);

      const onlineFollowings = followingIds.filter((id) =>
        onlineUserIds.includes(id)
      );

      socket.emit("online-users", onlineFollowings);
      console.log(`[GET-ONLINE] Sent to ${requestingUserId}:`, onlineFollowings);
    });

    socket.on("disconnect", async () => {
      if (!socket.userId) return;

      const count = await pubClient.decr(`online_user_count:${socket.userId}`);

      console.log(`[DISCONNECT] User ${socket.userId} count after decr: ${count}`);

      if (count <= 0) {
        await pubClient.sRem(ONLINE_USERS_SET, socket.userId);
        socket.broadcast.emit("user-offline", socket.userId);
        console.log(`[DISCONNECT] Broadcasted user-offline: ${socket.userId}`);
      }
    });
  });
}
