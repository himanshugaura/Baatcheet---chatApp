"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserMinus, MoveLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { searchUser, getAllContacts, toggleContact } from "@/lib/api/user";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function UserListPage() {
  const dispatch = useAppDispatch();
  const searchedUsers = useSelector((state: RootState) => state.user.searchedUsers);
  const contacts = useSelector((state: RootState) => state.user.contacts);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Fetch contacts on component mount
  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      if (value.trim().length > 0) {
        dispatch(searchUser(value.trim()));
      }
    }, 300);

    setDebounceTimer(timer);
  };

  const handleToggleContact = async (targetUserId: string) => {
    setLoadingUserId(targetUserId);
    try {
      await dispatch(toggleContact(targetUserId));
      await dispatch(getAllContacts()); 
    } finally {
      setLoadingUserId(null);
    }
  };

  // Check if a user is in contacts
  const isContact = (userId: string) => {
    return contacts.some(contact => contact._id === userId);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8 relative">
          {!isDesktop && (
            <Button
              size="sm"
              className="p-2 rounded-full absolute left-0 top-0"
              onClickLink="/dashboard"
            >
              <MoveLeft color="white" size={20} />
            </Button>
          )}
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Discover Users
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Search by username or email to find people
          </motion.p>
        </div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-6 md:mb-8"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 md:h-5 md:w-5" />
          <Input
            type="text"
            placeholder="Search users by email or username"
            className="pl-10 pr-4 h-10 md:h-12 text-sm md:text-base bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </motion.div>

        {/* User List */}
        <AnimatePresence mode="wait">
          {searchedUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 md:py-12 text-gray-500 text-sm md:text-base"
            >
              {searchTerm ? "No users found" : "Search for users to get started"}
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-3 md:gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {searchedUsers.map((user) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.01 }}
                  layout
                >
                  <Card className="bg-gray-800/50 border border-gray-700/50 rounded-lg md:rounded-xl backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                    <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
                      {/* Avatar */}
                      <Avatar className="h-10 w-10 md:h-14 md:w-14">
                        {user?.profileImage?.url ? (
                          <AvatarImage
                            referrerPolicy="no-referrer"
                            src={user.profileImage.url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : null}
                        <AvatarFallback>
                          {user.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                          <h3 className="text-sm md:text-lg font-semibold text-white truncate">
                            {user.name}
                          </h3>
                          <span className="text-xs text-purple-400 bg-purple-900/30 px-1.5 py-0.5 rounded-full">
                            @{user.userName}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-400 truncate">
                          {user.bio || "No bio provided"}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Button
                          active={true}
                          onClick={() => handleToggleContact(user._id)}
                          disabled={loadingUserId === user._id}
                          size="sm"
                          variant={isContact(user._id) ? "secondary" : "primary"}
                          className="text-xs md:text-sm"
                        >
                          {loadingUserId === user._id ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            <>
                              {isContact(user._id) ? (
                                <UserMinus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                              ) : (
                                <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                              )}
                              {isDesktop ? (
                                isContact(user._id) ? "Remove" : "Add"
                              ) : null}
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}