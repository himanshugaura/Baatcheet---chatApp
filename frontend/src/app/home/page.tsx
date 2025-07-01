"use client";
import Navbar from "@/components/home/Navbar";
import FeatureCard from "@/components/home/FeatureCard";
import {
  LayoutGrid,
  User,
  Image as LucideImage,
  MessageSquare,
  Users,
  UserPlus,
  Heart,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getUserData } from "@/lib/api/auth";
import Image from "next/image";

export default function HomePage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <Navbar />

      <section className="relative min-h-[90vh] md:min-h-screen  flex items-center justify-center overflow-hidden pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Content on Left - Mobile First */}
            <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 z-10 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  Connect
                </span>{" "}
                without limits
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
                Experience seamless communication with individuals and
                communities. Fast, secure, and designed for meaningful
                connections.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Button
                  active={true}
                  size="md"
                  className="w-full sm:w-auto"
                  onClickLink={`${isLoggedIn ? "/dashboard" : "/auth/login"}`}
                >
                  Get Started
                </Button>
                <Button
                  active={true}
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <Image
                      key={item}
                      src={`https://randomuser.me/api/portraits/${
                        item % 2 === 0 ? "women" : "men"
                      }/${item}0.jpg`}
                      alt="User"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white w-8 h-8 md:w-10 md:h-10 object-cover"
                    />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-400">
                  Join <span className="text-white font-medium">10,000+</span>{" "}
                  active users
                </p>
              </div>
            </div>

            {/* Video on Right */}
            <div className="w-full lg:w-1/2 flex justify-center relative mt-8 lg:mt-0">
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

              {/* Decorative elements - Adjusted for mobile */}
              <div className="absolute -z-10 w-full h-full max-w-lg">
                <div className="hidden sm:block absolute -top-10 sm:-top-20 -left-10 sm:-left-20 w-20 sm:w-40 h-20 sm:h-40 bg-purple-600/20 rounded-full blur-xl sm:blur-3xl"></div>
                <div className="hidden sm:block absolute -bottom-10 sm:-bottom-20 -right-10 sm:-right-20 w-30 sm:w-60 h-30 sm:h-60 bg-blue-600/20 rounded-full blur-xl sm:blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background gradient elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-900/10 rounded-full filter blur-xl sm:blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-900/10 rounded-full filter blur-xl sm:blur-3xl"></div>
        </div>
      </section>

      {/* Features Section - Improved Grid */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              Powerful Features for Seamless Communication
            </h2>
            <p className="mt-3 md:mt-4 max-w-2xl text-base md:text-lg text-white mx-auto">
              Everything you need to stay connected with friends, communities,
              and teams
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={LayoutGrid}
              title="Communities & Groups"
              description="Create and explore topic-based servers like forums or communities. Build group chats with unlimited members, admin controls, and rich discussions."
              bgColor="bg-indigo-500"
            />
            <FeatureCard
              icon={User}
              title="One-on-One Chat"
              description="Enjoy seamless individual chats with a clean and intuitive UI. Real-time messaging with typing indicators and instant delivery."
              bgColor="bg-blue-500"
            />
            <FeatureCard
              icon={LucideImage}
              title="Media & Sharing"
              description="Easily share photos, videos, and documents in any conversation. Engage deeply with rich content support and fast upload speeds."
              bgColor="bg-green-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
              How It Works
            </h3>
            <p className="text-base md:text-lg text-white max-w-2xl mx-auto">
              Get started in just a few simple steps and unlock the power of
              seamless collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 lg:gap-12">
            <FeatureCard
              icon={UserPlus}
              title="1. Sign Up"
              description="Create an account using Google or email in seconds."
              bgColor="bg-amber-600"
            />
            <FeatureCard
              icon={Users}
              title="2. Join or Create"
              description="Join existing communities or start your own space or chat with individuals."
              bgColor="bg-green-600"
            />
            <FeatureCard
              icon={MessageSquare}
              title="3. Start Chatting"
              description="Send messages, share media, and communicate in real-time."
              bgColor="bg-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 md:pt-16 pb-6 md:pb-8 bg-gray-900 text-white">
        <div className="w-full px-4 flex justify-center items-center flex-col">
          <div className="space-y-4 flex flex-col justify-center items-center text-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.png" alt="logo" width={50} height={50} />
            </Link>
            <p className="max-w-md text-sm md:text-base">
              Connect, collaborate, and communicate seamlessly with individuals
              and communities.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com"
                className="hover:text-black transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="hover:text-black transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="hover:text-black transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-xs md:text-sm">
            <p>© {new Date().getFullYear()} BaatCheet. All rights reserved.</p>
            <p className="mt-2 flex items-center justify-center">
              Made with{" "}
              <Heart className="h-3 w-3 md:h-4 md:w-4 mx-1 fill-red-500 text-red-500" />{" "}
              for better communication
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
