  "use client";

  import { SidebarNav } from "@/components/dashboard/SidebarNav";
  import { SidebarPanel } from "@/components/dashboard/SidebarPanel";
  import { useMediaQuery } from "@/hooks/use-media-query";
  import { motion } from "framer-motion";
  import { Sparkles } from "lucide-react";
  import { useEffect, useState } from "react";
  import { Tab } from "./layout";

  export default function DashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [activeTab, setActiveTab] = useState<Tab>("chat");
    useEffect(() => {
      setIsClient(true);
    }, []);
    if(!isDesktop)
    {
      return(
      <div className="flex min-h-screen">
                <SidebarNav activeTab={activeTab} onChange={setActiveTab} />
                <SidebarPanel activeTab={activeTab} />
      </div>)
    }
    return (
      <div className="flex-1 overflow-y-auto bg-[#040617] relative min-h-screen flex items-center justify-center">
        {/* Claymorphism elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isClient && (
            <>
              {/* Large background blob */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-lg filter blur-xl"
              />

              {/* Floating clay cards */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    y: 50,
                    x: Math.random() * 200 - 100,
                  }}
                  animate={{
                    opacity: 0.6,
                    y: 0,
                    x: [null, Math.random() * 40 - 20],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.3,
                  }}
                  className={`absolute rounded-3xl bg-gradient-to-br backdrop-blur-sm border border-white/10 ${
                    i % 3 === 0
                      ? "from-purple-900/30 to-blue-900/30 w-32 h-32"
                      : i % 2 === 0
                      ? "from-indigo-900/30 to-violet-900/30 w-24 h-24"
                      : "from-blue-900/30 to-purple-900/30 w-28 h-28"
                  }`}
                  style={{
                    top: `${15 + Math.random() * 70}%`,
                    left: `${10 + Math.random() * 80}%`,
                    rotate: `${Math.random() * 20 - 10}deg`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-medium text-purple-400 tracking-wider">
                WELCOME BACK
              </span>
            </motion.div>
            <motion.h1
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Let&apos;s start chatting
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-300 max-w-md mx-auto"
            >
              Select a conversation or explore the app using the sidebar menus.
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }