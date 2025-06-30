import React from "react";
import { motion } from "framer-motion";
import AnimatedWords from "./AnimatedWords"; 

const HeroCard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-[80%] md:w-[40%] rounded-2xl overflow-hidden`}
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2)"
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#ff9966] opacity-20 blur-xl"
          animate={{
            x: [0, 15, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[#5e62ff] opacity-20 blur-xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Card Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
        {/* Main Content */}
        <div className="space-y-6 mt-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Your Space to{" "}
            <span className="inline-block w-[100px] text-left">
              <AnimatedWords />
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg"
          >
            Discover our premium solutions designed to transform your online experience
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255, 153, 102, 0.5)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-[#ff9966] to-[#ff5e62] text-white font-medium text-lg shadow-lg"
        >
          Get Started Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroCard;