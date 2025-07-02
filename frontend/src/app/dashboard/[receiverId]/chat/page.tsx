"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import Loader from "@/components/common/Loader";
import { Message } from "@/types/type";
import { fetchMessages, fetchOnlineStatus, sendMessage } from "@/lib/api/chat";

let socket: Socket | null = null;

export default function ChatWithUser() {
  const { receiverId } = useParams();
  const receiver = receiverId as string;
  const { user } = useSelector((state: RootState) => state.auth);
  const following = useSelector((state: RootState) => state.user.followedUsers);
  const chatUser = following.find(user => user._id === receiver);

  const dispatch = useAppDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messages: Message[] = useSelector((state: RootState) => state.chat.messages);
  const isReceiverOnline = useSelector((state: RootState) => state.chat.isReceiverOnline);
  
  const getRoomId = (id1: string, id2: string): string =>
    [id1, id2].sort().join("_");

  useEffect(() => {
    const loadData = async () => {
      if (user?._id && receiver) {
        await dispatch(fetchMessages(user._id, receiver));
        await dispatch(fetchOnlineStatus(receiver));
      }
      setLoadingMessages(false);
    };
    loadData();
  }, [dispatch, user?._id, receiver]);

  useEffect(() => {
    if (!user?._id) return;

    socket = io("http://localhost:3030");
    socket.emit("join", user._id);

    socket.on("receive-message", () => {
      if (user?._id && receiver) {
        dispatch(fetchMessages(user._id, receiver));
      }
    });

    socket.on("user-online", (id: string) => {
      if (id === receiver) dispatch(fetchOnlineStatus(receiver));
    });

    socket.on("user-offline", (id: string) => {
      if (id === receiver) dispatch(fetchOnlineStatus(receiver));
    });

    return () => {
      socket?.disconnect();
    };
  }, [dispatch, user?._id, receiver]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user?._id) return;

    const roomId = getRoomId(user._id, receiver);
    await dispatch(
      sendMessage(
        user._id,
        receiver,
        newMessage,
        roomId,
        replyingTo?._id ?? null
      )
    );
    
    socket?.emit("send-message", { receiverId: receiver });
    setNewMessage("");
    setReplyingTo(null);
  };


  if (loadingMessages) {
    return <Loader />;
  }

  return (
    <div className="p-4 h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {chatUser?.name.charAt(0)}
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isReceiverOnline ? "bg-green-500" : "bg-gray-400"}`}></span>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-800">{chatUser?.name}</h2>
            <p className={`text-xs ${isReceiverOnline ? "text-green-600" : "text-gray-500"}`}>
              {isReceiverOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 mb-3 bg-white rounded-lg shadow-sm">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[80%] rounded-lg p-3 ${msg.senderId === user?._id 
                  ? "bg-blue-500 text-white rounded-br-none" 
                  : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
              >
                {/* Reply indicator */}
                {msg.replyTo && (
                  <div className={`mb-2 p-2 text-xs rounded-t-lg border-l-3 ${msg.senderId === user?._id 
                    ? "bg-blue-400 border-l-blue-600 text-blue-100" 
                    : "bg-gray-100 border-l-gray-400 text-gray-600"}`}>
                    <p className="font-medium">Replying to:</p>
                    <p className="truncate italic">{msg.replyTo.text}</p>
                  </div>
                )}
                
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                {/* Timestamp */}
                <div className={`text-xs mt-1 ${msg.senderId === user?._id ? "text-blue-100" : "text-gray-500"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                {/* Reply button */}
                <button
                  className={`absolute -bottom-3 right-1 w-6 h-6 flex items-center justify-center rounded-full ${msg.senderId === user?._id 
                    ? "bg-blue-400 hover:bg-blue-600 text-white" 
                    : "bg-gray-300 hover:bg-gray-400 text-gray-700"}`}
                  onClick={() => setReplyingTo(msg)}
                  title="Reply"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l7-7m0 0l7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Reply preview */}
      {replyingTo && (
        <div className="mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-blue-800">Replying to:</p>
            <p className="text-sm text-blue-600 truncate max-w-[80%]">
              {replyingTo.text.length > 30 
                ? `${replyingTo.text.substring(0, 30)}...` 
                : replyingTo.text}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Message input */}
      <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
        <input
          type="text"
          className="flex-1 border-0 rounded-lg p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200"
          onClick={handleSend}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}