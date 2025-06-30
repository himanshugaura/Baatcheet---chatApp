"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { RootState } from "@/store/store";

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  roomId: string;
}

let socket: Socket | null = null;

export default function ChatWithUser() {
  const { receiverId } = useParams();
  const receiver = receiverId as string;
  const { user } = useSelector((state: RootState) => state.auth);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const getRoomId = (id1: string, id2: string): string =>
    [id1, id2].sort().join("_");

  useEffect(() => {
    if (!user?._id || !receiver) return;

    const fetchMessagesAndStatus = async () => {
      // Load message history
      const res = await axios.get(
        `http://localhost:3030/api/chat/messages/${user._id}/${receiver}`
      );
      setMessages(res.data);

      // Check receiver's current online status
      const statusRes = await axios.get(
        `http://localhost:3030/api/online/${receiver}/status`
      );      
      setIsReceiverOnline(statusRes.data.isOnline);
    };

    fetchMessagesAndStatus();

    // Connect socket
    socket = io("http://localhost:3030");
    socket.emit("join", user._id);

    // Real-time message listener
    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Online status updates
    socket.on("user-online", (id: string) => {
      if (id === receiver) setIsReceiverOnline(true);
    });

    socket.on("user-offline", (id: string) => {
      if (id === receiver) setIsReceiverOnline(false);
    });

    return () => {
      socket?.disconnect();
    };
  }, [receiver, user?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user || !user._id) return;

    const roomId = getRoomId(user?._id, receiver);

    const msg: Message = {
      senderId: user?._id,
      receiverId: receiver,
      roomId,
      text: newMessage,
    };

    await axios.post("http://localhost:3030/api/chat/message", msg);
    socket?.emit("send-message", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="p-4 h-screen flex flex-col bg-[#22303C]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white">Chat</h2>
        <span
          className={`text-sm font-medium ${
            isReceiverOnline ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isReceiverOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto border rounded p-2 mb-2 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-1 p-2 rounded max-w-[70%] ${
              msg.senderId === user?._id
                ? "bg-blue-100 text-right ml-auto"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded p-2 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
