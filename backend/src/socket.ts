import { Server, Socket } from "socket.io";

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
        socket.broadcast.emit("user-online", userId);
      }
    });

    socket.on("disconnect", async () => {
      const userId = socket.userId;
      if (!userId) return;

      const sockets = userSocketMap.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSocketMap.delete(userId);
          socket.broadcast.emit("user-offline", userId);
        }
      }
    });
  });
}
