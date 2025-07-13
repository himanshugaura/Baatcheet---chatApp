import { io, Socket } from "socket.io-client";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export let socket: Socket | null = null;
export const connectSocket = (userId: string) => {
  if (!socket) {
    socket = io(BASE_URL);
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