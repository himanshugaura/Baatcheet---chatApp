"use client";

import { Lock } from "lucide-react";

const dummyPrivateGroups = [
  { id: 1, name: "Private Team", members: 5 },
  { id: 2, name: "Friends", members: 8 },
];

export default function PrivateGroupsPanel() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">Private Groups</h2>
      {dummyPrivateGroups.map((group) => (
        <div key={group.id} className="p-3 hover:bg-accent rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-lg">
              <Lock className="h-4 w-4" />
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
