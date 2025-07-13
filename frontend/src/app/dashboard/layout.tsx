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
import { useMediaQuery } from "@/hooks/use-media-query";


export type Tab = "chat" | "follow" | "freinds" | "setting";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isDesktop = useMediaQuery("(min-width: 768px)");

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
    return <Loader />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {isDesktop ? (
        <>
          <SidebarNav activeTab={activeTab} onChange={setActiveTab} />
          <SidebarPanel activeTab={activeTab} />
        </>
      ) : (
        <div className="fixed bottom-0 w-full">

        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-[#040617]">
        {children}
      </main>
    </div>
  );
}
