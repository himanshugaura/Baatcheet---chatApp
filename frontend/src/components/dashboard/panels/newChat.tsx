"use client";

import { MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getAllContacts } from "@/lib/api/user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/common/Loader";

export default function NewChat() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const contacts = useSelector((state: RootState) => (
    state.user.contacts
  ));

  useEffect(() => {
    const fetchUsers = async () => {
      await dispatch(getAllContacts());
    };
    fetchUsers();
  }, [dispatch]);

  const startChat = (receiverId: string) => {
    router.push(`/dashboard/${receiverId}/chat`);
  };

  if (!contacts) {
    <Loader />
  }

  return (
    <div className="p-4 flex flex-col gap-3  items-center">
      <Button 
      active={true}
      variant="primary"
       onClickLink={"/dashboard/searchUser"}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Contact
      </Button>

      <div className="mt-4 space-y-3">
        <h3 className="text-lg font-semibold">Your Contacts</h3>
        
   {contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No contacts found</p>
            <p className="text-sm">Add contacts to start chatting</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.ul className="space-y-2">
              {contacts.map((contact) => (
                <motion.li
                  key={contact._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                        referrerPolicy="no-referrer"
                          src={contact.profileImage?.url} 
                          alt={contact.name}
                        />
                        <AvatarFallback>
                          {contact.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{contact.name}</p>
                      </div>
                    </div>
                    <Button
                      active={true}
                      size="sm"
                      variant="secondary"
                      onClick={() => startChat(contact._id)}
                      className="shrink-0"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}