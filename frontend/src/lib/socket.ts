import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;
export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io("http://localhost:3030");
    socket.emit("join", userId);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


export function getSocket(): Socket {
  if (!socket) throw new Error("Socket not connected");
  return socket;
}