"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const dummyFollowed = [
  { id: 1, name: "Alice", status: "online" },
  { id: 2, name: "Bob", status: "offline" },
];

export default function FollowedUsersPanel() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">Followed Users</h2>
      {dummyFollowed.map((user) => (
        <div key={user.id} className="p-3 hover:bg-accent rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`/avatars/${user}.jpg`} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{user.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
