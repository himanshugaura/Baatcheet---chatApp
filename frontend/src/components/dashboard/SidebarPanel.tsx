import { Tab } from "@/app/dashboard/layout";
import { ChatPanel } from "../dashboard/panels/ChatPanel";
import  FollowedUsersPanel  from "../dashboard/panels/FollowedUsersPanel";
import  CreateGroupPanel  from "./panels/FollowUser";

export function SidebarPanel({ activeTab }: { activeTab: Tab }) {
  return (
    <div className="w-64 border-r bg- p-4 overflow-y-auto text-white">
      {activeTab === "chat" && <ChatPanel />}
      {activeTab === "follow" && <FollowedUsersPanel />}
      {activeTab === "freinds" && <CreateGroupPanel />}
    </div>
  );
}
