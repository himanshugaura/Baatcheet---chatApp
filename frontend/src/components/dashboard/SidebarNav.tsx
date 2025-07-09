import { MessageSquare, Users, Lock, Bell, PlusCircle, LogOut, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Tab } from "@/app/dashboard/layout";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";

interface SidebarNavProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export function SidebarNav({ activeTab, onChange }: SidebarNavProps) {
  const  user  = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  

  
  const handleLogout =async () => {
    const result = await dispatch(logout()); // Dispatch the logout action
    if(result)
      router.push("/")
  };

  const getInitials = (userName: string) => {
    return userName[0];
  };

  

  return (
    <div className="w-20 border-r flex flex-col items-center py-4 text-white">
      <SidebarIconButton
        icon={<MessageSquare className="h-5 w-5" />}
        active={activeTab === "chat"}
        onClick={() => onChange("chat")}
        tooltip="Chat"
      />

      <SidebarIconButton
        icon={<PlusCircle className="h-5 w-5" />}
        active={activeTab === "freinds"}
        onClick={() => onChange("freinds")}
        tooltip="New Chat"
      />
      

      {/* User Avatar and Username */}
      <div className="mt-auto flex flex-col items-center space-y-2">

        <Avatar className="w-10 h-10 text-black">
          <AvatarImage src={user?.profileImage?.url } alt={user?.name} 
            referrerPolicy="no-referrer"/>
          <AvatarFallback>{getInitials(user?.userName || "")}</AvatarFallback>
        </Avatar>
        
        <SidebarIconButton
        icon={<Settings className="h-5 w-5" />}
        onClick={() => router.push("/dashboard/setting")}
        tooltip="Setting"
    />
        {/* Logout Button */}
        <Button
          variant="ghost"
          size="icon"
          className="my-2"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function SidebarIconButton({ icon, active, onClick, tooltip }: { icon: React.ReactNode; active?: boolean; onClick: () => void; tooltip: string }) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="icon"
      className={`my-1 ${active ? "font-semibold" : ""}`}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
    </Button>
  );
}
