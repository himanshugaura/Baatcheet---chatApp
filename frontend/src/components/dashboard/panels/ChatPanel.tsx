"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserChats } from "@/lib/api/user";
import { User } from "@/types/type";

export function ChatPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);

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
