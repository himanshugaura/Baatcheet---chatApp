"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, User, UserMinus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { getAllUsers, toggleFollowUser } from "@/lib/api/user";

export default function UserListPage() {
  const dispatch = useAppDispatch();

  const usersFromStore = useSelector((state: RootState) => state.user.users);
  const authUser = useSelector((state: RootState) => state.user.followedUsers);

  const [localUsers, setLocalUsers] = useState(usersFromStore);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      await dispatch(getAllUsers());
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    setLocalUsers(usersFromStore);
  }, [usersFromStore]);

  const handleToggleFollow = async (targetUserId: string) => {
    setLoadingUserId(targetUserId);
    await dispatch(toggleFollowUser(targetUserId));
    setLoadingUserId(null);
  };

  const filteredUsers = localUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Discover Friends
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Find and connect with amazing people
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search users..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500"
            >
              No users found matching your search.
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {filteredUsers.map((user) => {
                const isFollowing = authUser?.some((u) => u._id === user._id);
                return (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.01 }}
                    layout
                  >
                    <Card className="bg-gray-800/50 border border-gray-700/50 rounded-xl backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-purple-500/30">
                          {user?.profileImage?.url ? (
                            <AvatarImage
                              referrerPolicy="no-referrer"
                              src={user.profileImage?.url}
                              alt={user.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : null}
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                            {user.name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex  items-center gap-2">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {user.name}
                            </h3>
                            <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full">
                              @{user.userName}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 truncate">
                            {user.bio || "No bio yet"}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span className="font-medium text-purple-300 mr-1">
                              {user.followers?.length?.toLocaleString() || 0}
                            </span>
                            <span>followers</span>
                            <span className="mx-1">•</span>
                            <span className="font-medium text-purple-300 mr-1">
                              {user.following?.length?.toLocaleString() || 0}
                            </span>
                            <span>following</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                          active={true}
                            onClick={() => handleToggleFollow(user._id)}
                            disabled={loadingUserId === user._id}
                            size="sm"
                            variant={isFollowing ? "secondary" : "primary"}
                          >
                            {loadingUserId === user._id ? (
                              <span className="animate-pulse">...</span>
                            ) : isFollowing ? (
                              <>
                              
                                <UserMinus className="h-4 w-4 mr-2" />
                                Unfollow
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4 mr" />
                                Follow
                              </>
                            )}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClickLink={`/profile/${user._id}`}
                          >
                            <User className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}