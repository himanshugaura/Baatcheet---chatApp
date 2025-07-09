"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserChats } from "@/lib/api/user";
import { User } from "@/types/type";
import { socket } from "@/lib/socket";

export function ChatPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        setLoading(true);
        await dispatch(getUserChats());
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user?._id]);


useEffect(() => {
  if (!socket) return;

  socket.emit("get-online-users");

  socket.on("online-users", (onlineIds: string[]) => {
    const statusMap = onlineIds.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setOnlineStatus(statusMap);
  });

  socket.on("user-online", (id: string) => {
    setOnlineStatus((prev) => ({ ...prev, [id]: true }));
  });

  socket.on("user-offline", (id: string) => {
    setOnlineStatus((prev) => ({ ...prev, [id]: false }));
  });

  return () => {
    socket?.off("online-users");
    socket?.off("user-online");
    socket?.off("user-offline");
  };
}, []);
  console.log(chats);
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Chats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : chats?.length > 0 ? (
        chats.map((user: User) => (
          <div
            key={user._id}
            className="p-3 hover:bg-accent rounded-lg cursor-pointer hover:text-black"
            onClick={() => router.push(`/dashboard/${user._id}/chat`)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 text-black">
                <AvatarImage
                  src={user.profileImage?.url}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {user.name || "No Username"}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {onlineStatus[user._id]
                    ? "Online"
                    : user.isOnline || "Offline"}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No chats found. Start a new conversation.</p>
      )}
    </div>
  );
}
