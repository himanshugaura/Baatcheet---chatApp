"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllFolllowedUsers } from "@/lib/api/user";
import { io, Socket } from "socket.io-client";
import { User } from "@/types/type";

let socket: Socket | null = null;

export function ChatPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { followedUsers } = useSelector((state: RootState) => state.chat);
  const [loading, setLoading] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (user?._id) {
        setLoading(true);
        await dispatch(getAllFolllowedUsers());
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (!user?._id) return;
  
    socket = io("http://localhost:3030");
  
    socket.on("connect", () => {
      console.log("Socket connected");
      socket?.emit("join", user._id);
      socket?.emit("get-online-users");
    });
  
    socket.on("online-users", (onlineIds: string[]) => {
      console.log("Online users:", onlineIds);
      const statusMap = onlineIds.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as { [key: string]: boolean });
      setOnlineStatus(statusMap);
    });
  
    socket.on("user-online", (id: string) => {
      console.log("User online:", id);
      setOnlineStatus((prev) => ({ ...prev, [id]: true }));
    });
  
    socket.on("user-offline", (id: string) => {
      console.log("User offline:", id);
      setOnlineStatus((prev) => ({ ...prev, [id]: false }));
    });
  
    return () => {
      socket?.disconnect();
    };
  }, [user?._id]);
  

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Followed Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : followedUsers?.length > 0 ? (
        followedUsers.map((followedUser: User) => (
          <div
            key={followedUser._id}
            className="p-3 hover:bg-accent rounded-lg cursor-pointer hover:text-black"
            onClick={() => router.push(`/dashboard/${followedUser._id}/chat`)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 text-black">
                <AvatarImage src={followedUser.profileImage?.url} />
                <AvatarFallback>{followedUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {followedUser.userName || "No Username"}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {onlineStatus[followedUser._id]
                    ? "Online"
                    : followedUser.isOnline || "Offline"}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No followed users found</p>
      )}
    </div>
  );
}
