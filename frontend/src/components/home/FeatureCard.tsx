import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor?: string;
  delay?: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  bgColor = "bg-indigo-500",
  delay = 0,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const iconVariants = {
    normal: { rotate: 0 },
    hover: { rotate: 360 },
  };

  const glowVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    hover: {
      opacity: 0.4,
      scale: 1.2,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="group relative"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      {isHovered && (
        <motion.div
          className={`absolute inset-0 rounded-xl blur-md ${bgColor.replace("bg-", "bg-opacity-20 ")}`}
          variants={glowVariants}
          initial="initial"
          animate="hover"
        />
      )}

      <div className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all p-8 flex flex-col justify-center items-center z-10 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className={`absolute -bottom-8 -right-8 h-32 w-32 rounded-full ${bgColor} opacity-10`}
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className={`flex items-center justify-center h-14 w-14 rounded-lg ${bgColor} text-white mb-6 relative z-10`}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            variants={iconVariants}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
        </motion.div>

        <h3 className="text-xl font-semibold text-white mb-3 text-center">
          {title}
        </h3>
        <p className="text-gray-400 text-justify leading-relaxed">
          {description}
        </p>

        {/* Subtle border animation on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          animate={{
            borderColor: isHovered ? "rgba(99, 102, 241, 0.3)" : "transparent",
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}