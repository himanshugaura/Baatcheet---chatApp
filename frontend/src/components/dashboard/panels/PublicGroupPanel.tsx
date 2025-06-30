"use client";

import { Users } from "lucide-react";

const dummyGroups = [
  { id: 1, name: "Public Group 1", members: 24 },
  { id: 2, name: "Public Group 2", members: 15 },
];

export default function PublicGroupsPanel() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">Public Groups</h2>
      {dummyGroups.map((group) => (
        <div key={group.id} className="p-3 hover:bg-accent rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-lg">
              <Users className="h-4 w-4 text-black" />
            </div>
            <div>
              <h3 className="font-medium">{group.name}</h3>
              <p className="text-sm text-muted-foreground">{group.members} members</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
