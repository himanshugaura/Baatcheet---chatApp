import { Tab } from "@/app/dashboard/layout";
import { ChatPanel } from "../dashboard/panels/ChatPanel";
import PublicGroupsPanel from "../dashboard/panels/PublicGroupPanel";
import  PrivateGroupsPanel  from "../dashboard/panels/PrivateGroupPanel";
import  FollowedUsersPanel  from "../dashboard/panels/FollowedUsersPanel";
import  CreateGroupPanel  from "../dashboard/panels/CreateGroupPanel";

export function SidebarPanel({ activeTab }: { activeTab: Tab }) {
  return (
    <div className="w-64 border-r bg- p-4 overflow-y-auto text-white">
      {activeTab === "chat" && <ChatPanel />}
      {activeTab === "public" && <PublicGroupsPanel />}
      {activeTab === "private" && <PrivateGroupsPanel />}
      {activeTab === "follow" && <FollowedUsersPanel />}
      {activeTab === "create" && <CreateGroupPanel />}
    </div>
  );
}
