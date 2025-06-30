"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; 


export default function CreateGroupPanel() {
  const router = useRouter();
  
  return (
    <div className="p-4 flex flex-col gap-3">
      <h2 className="text-lg font-semibold mb-4">Create New</h2>
      <Button className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Group
      </Button>
      
      <Button className="w-full" onClick={() => router.push("/dashboard/followUsers")}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Friends
      </Button>
    </div>
  );
}
