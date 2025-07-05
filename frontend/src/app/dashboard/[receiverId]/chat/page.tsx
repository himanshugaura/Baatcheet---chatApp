"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import Loader from "@/components/common/Loader";
import { Message } from "@/types/type";
import { fetchMessages, sendMessage } from "@/lib/api/chat";
import { Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  getSocket } from "@/lib/socket";
import { addMessage } from "@/store/features/chat.slice";

export default function ChatWithUser() {
  const { receiverId } = useParams();
  const receiver = receiverId as string;

  const { user } = useSelector((state: RootState) => state.auth);
  const following = useSelector((state: RootState) => state.user.followedUsers);
  const chatUser = following.find((user) => user._id === receiver);

  const dispatch = useAppDispatch();

  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const messages: Message[] = useSelector(
    (state: RootState) => state.chat.messages
  );

  const getRoomId = (id1: string, id2: string): string =>
    [id1, id2].sort().join("_");

  useEffect(() => {
    const loadData = async () => {
      if (user?._id && receiver) {
        await dispatch(fetchMessages(user._id, receiver));
      }
      setLoadingMessages(false);
    };
    loadData();
  }, [dispatch, user?._id, receiver]);

  

  useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  const handleUserOnline = (userId: string) => {    
    if (userId === receiver) setIsReceiverOnline(true);
  };

  const handleUserOffline = (userId: string) => {
    
    if (userId === receiver) setIsReceiverOnline(false);
  };

  socket.on("user-online", handleUserOnline);
  socket.on("user-offline", handleUserOffline);

  return () => {
    socket.off("user-online", handleUserOnline);
    socket.off("user-offline", handleUserOffline);
  };
}, [user?._id, receiver]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      if(user)
      {
        if (message.roomId === getRoomId(user?._id, receiver)) {
          dispatch(addMessage(message));
        }

      }
    };

  socket.on("receive-message", handleReceiveMessage);

  return () => {
    socket.off("receive-message", handleReceiveMessage);
  };
}, [dispatch, receiver, user?._id]);



  // Auto scroll on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send handler
  const handleSend = useCallback(async () => {
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

    setNewMessage("");
    setReplyingTo(null);
  }, [dispatch, newMessage, user?._id, receiver, replyingTo]);

  if (loadingMessages) return <Loader />;

  return (
    <div className="flex flex-col h-screen px-2 py-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-br from-[#191c21]/90 to-[#23272f]/80 rounded-2xl shadow-lg border border-[#23272f]">
        <div className="flex items-center">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={chatUser?.profileImage?.url || undefined}
                alt={chatUser?.name || "User"}
              />
              <AvatarFallback>{chatUser?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 ${
                isReceiverOnline ? "bg-green-400" : "bg-gray-500"
              }`}
            />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-100">
              {chatUser?.name}
            </h2>
            <p className="text-xs text-gray-100">
              {isReceiverOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 mb-3 bg-gradient-to-br from-[#191c21]/90 to-[#23272f]/80 rounded-2xl shadow-lg border border-[#23272f] transition-all scrollbar-thin scrollbar-thumb-blue-800/30 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm opacity-80">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isSender = msg.senderId === user?._id;
            return (
              <div
                key={idx}
                className={`mb-6 flex ${
                  isSender ? "justify-end" : "justify-start"
                } group`}
              >
                <div
                  className={`relative max-w-[83vw] sm:max-w-[70%] md:max-w-[55%] rounded-2xl px-5 py-4 shadow-xl transition-all
                  ${
                    isSender
                      ? "bg-gradient-to-br from-[#557c93] to-[#08203e] text-white rounded-br-md"
                      : "bg-gradient-to-br from-[#23272f] to-[#181e24] text-blue-100 rounded-bl-md border border-[#282c34]"
                  }`}
                >
                  {msg.replyTo && (
                    <div
                      className={`mb-2 p-2 text-xs rounded-t-lg border-l-4 ${
                        isSender
                          ? "bg-blue-800/60 border-l-blue-400 text-blue-100"
                          : "bg-gray-800/60 border-l-blue-700 text-blue-200"
                      }`}
                    >
                      <span className="font-medium opacity-80">
                        Replying to:
                      </span>
                      <p className="truncate italic opacity-80">
                        {msg.replyTo.text}
                      </p>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap text-[1rem] font-medium tracking-wide">
                    {msg.text}
                  </p>

                  <div
                    className={`text-xs mt-1 ${
                      isSender
                        ? "text-blue-300/80"
                        : "text-gray-400/80"
                    } select-none`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <button
                    className={`absolute -bottom-4 right-2 w-7 h-7 flex items-center justify-center rounded-full opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                    ${
                      isSender
                        ? "bg-gradient-to-tr from-blue-500 to-blue-700 hover:from-blue-700 hover:to-purple-600 text-white"
                        : "bg-gray-700 hover:bg-blue-800 text-blue-200"
                    } shadow-lg transition-all duration-200 cursor-pointer`}
                    onClick={() => setReplyingTo(msg)}
                    title="Reply"
                  >
                    <Reply size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {replyingTo && (
        <div className="mb-3 flex items-center justify-between p-3 bg-gradient-to-r from-blue-600/60 to-purple-600/60 rounded-xl border border-blue-800/50 shadow-lg animate-fade-in">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/80">Replying to:</p>
            <p className="text-sm text-white truncate max-w-[80vw]">
              {replyingTo.text.length > 40
                ? `${replyingTo.text.substring(0, 40)}...`
                : replyingTo.text}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-4 text-red-400 hover:text-red-600 transition-colors"
            title="Cancel reply"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 bg-gradient-to-r from-[#23272f] to-[#181e24] rounded-xl shadow-xl px-4 py-3 border border-[#23272f]">
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          autoFocus
          maxLength={1000}
        />
        <button
          className="ml-2 w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 flex items-center justify-center shadow-lg transition-all duration-200"
          onClick={handleSend}
          aria-label="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="white"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
