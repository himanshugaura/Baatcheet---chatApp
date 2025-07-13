"use client";
import Navbar from "@/components/home/Navbar";
import { Heart, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getUserData } from "@/lib/api/auth";
import Image from "next/image";
import { Variants, motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  delay: number = 0
): Variants => ({
  hidden: {
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
      delay,
      duration: 0.8,
    },
  },
});

const floatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 8,
    repeat: Infinity,
    repeatType: "loop" as const,
    ease: "easeInOut" as const,
  },
};

export default function HomePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  const isLoggedIn = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="overflow-x-hidden"
    >
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            variants={containerVariants}
            className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
          >
            {/* Content on Left */}
            <motion.div
              variants={fadeIn("right")}
              className="w-full lg:w-1/2 space-y-6 md:space-y-8 z-10 text-center lg:text-left"
            >
              <motion.h1
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Connect
                </span>{" "}
                without limits
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg lg:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0"
              >
                Experience seamless communication with friends and family. Fast,
                secure, and designed for meaningful connections.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start "
              >
                <Button
                  size="md"
                  active={true}
                  variant="primary"
                  onClick={() =>
                    router.push(`${isLoggedIn ? "/dashboard" : "/auth/login"}`)
                  }
                >
                  Get Started
                </Button>

                <Button active={true} size="md" variant="secondary">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Video on Right */}
            <motion.div
              variants={fadeIn("left", 0.2)}
              className="w-full lg:w-1/2 flex justify-center relative mt-8 lg:mt-0"
            >
              <div className="relative rounded-xl overflow-hidden w-full max-w-md lg:max-w-lg aspect-video">
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10"></div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 w-full h-full max-w-lg">
                <div className="hidden sm:block absolute -top-10 sm:-top-20 -left-10 sm:-left-20 w-20 sm:w-40 h-20 sm:h-40 bg-purple-600/20 rounded-full blur-xl sm:blur-3xl"></div>
                <div className="hidden sm:block absolute -bottom-10 sm:-bottom-20 -right-10 sm:-right-20 w-30 sm:w-60 h-30 sm:h-60 bg-blue-600/20 rounded-full blur-xl sm:blur-3xl"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background gradient elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-900/10 rounded-full filter blur-xl sm:blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-900/10 rounded-full filter blur-xl sm:blur-3xl"></div>
        </div>
      </section>

      {/*  Hero Image Section */}
      <section className="relative  md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            className="flex flex-col-reverse lg:flex-row items-center lg:gap-12"
          >
            {/* Animated Image */}
            <motion.div
              variants={fadeIn("right", 0.2)}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative  mx-auto aspect-square">
                <motion.div
                  animate={floatAnimation}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/hero.png"
                    alt="People chatting through screens"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>

                {/* Glow effects */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl -z-10"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full filter blur-3xl -z-10"></div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              variants={fadeIn("left", 0.4)}
              className="w-full lg:w-1/2 space-y-6 md:space-y-8"
            >
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight text-center"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Digital Connections
                </span>{" "}
                Made Real
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-gray-300 text-justify"
              >
                Connect like never before. Our platform closes the distance
                between you and your loved ones, turning every conversation into
                a shared moment.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-900/10 rounded-full filter blur-3xl"></div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="pt-12 md:pt-16 pb-6 md:pb-8 bg-gray-900 text-white"
      >
        <div className="w-full px-4 flex justify-center items-center flex-col">
          <motion.div
            variants={containerVariants}
            className="space-y-4 flex flex-col justify-center items-center text-center"
          >
            <motion.div variants={fadeUp}>
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={50}
                  height={50}
                />
              </Link>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="max-w-md text-sm md:text-base"
            >
              Connect, and communicate seamlessly with friends and family.
            </motion.p>
            <motion.div variants={fadeUp} className="flex space-x-4">
              <Link
                href="https://github.com/himanshugaura"
                className="hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/himanshu-gaura-903941322"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-xs md:text-sm"
          >
            <p>© {new Date().getFullYear()} BaatCheet. All rights reserved.</p>
            <p className="mt-2 flex items-center justify-center">
              Made with{" "}
              <Heart className="h-3 w-3 md:h-4 md:w-4 mx-1 fill-red-500 text-red-500" />{" "}
              for better communication
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
