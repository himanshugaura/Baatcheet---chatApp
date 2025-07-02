"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { getUserData } from "@/lib/api/auth";
import Loader from "@/components/common/Loader";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { SidebarPanel } from "@/components/dashboard/SidebarPanel";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export type Tab = "chat" | "public" | "private" | "follow" | "create";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      await dispatch(getUserData());
      setIsCheckingUser(false);
    };
    checkUser();
  }, [dispatch]);

  useEffect(() => {
    if (!isCheckingUser && user === null) {
      router.push("/auth/login");
    }
  }, [isCheckingUser, user, router]);


  useEffect(() => {
    if (!user?._id) return;

    connectSocket(user._id);

    return () => {
      disconnectSocket();
    };
  }, [user?._id]);

   if (isCheckingUser) {
    return (
      <Loader/>
    );
  }

 return (
  <div className="flex h-screen overflow-hidden">
    <SidebarNav activeTab={activeTab} onChange={setActiveTab} />
    <SidebarPanel activeTab={activeTab} />
    <main className="flex-1 overflow-y-auto  bg-[#040617]">
      {children}
    </main>
  </div>
);

}
