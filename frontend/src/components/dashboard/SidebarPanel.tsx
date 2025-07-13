import { Tab } from "@/app/dashboard/layout";
import { ChatPanel } from "../dashboard/panels/ChatPanel";
import NewChat from "./panels/newChat";

export function SidebarPanel({ activeTab }: { activeTab: Tab }) {
  return (
    <div className="w-full border-r bg- p-4 overflow-y-auto text-white md:w-fit">
      {activeTab === "chat" && <ChatPanel />}
      {activeTab === "freinds" && <NewChat />}
    </div>
  );
}
