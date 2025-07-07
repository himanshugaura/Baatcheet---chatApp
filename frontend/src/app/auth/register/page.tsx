"use client";

import { Mail, User, Lock, ArrowRight, Eye, EyeOff, Check, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getUserData, sendOTP, verifyEmail, verifyUserName } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import LoginWithGoogle from "@/components/login/LoginWithGoogle";
import Loader from "@/components/common/Loader";

// Define form schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  userName: z.string().min(4, "User ID must be at least 4 characters"),
  name: z.string().min(1, "Please enter a valid name"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const dispatch = useAppDispatch();

   useEffect(() => {
      const checkUser = async () => {
        await dispatch(getUserData());
        setIsCheckingUser(false);
      };
      checkUser();
    }, [dispatch]);
  

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      userName: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password changes to update requirements
  const password = form.watch("password");
  const [debouncedPassword] = useDebounce(password, 300);

  useEffect(() => {
    if (debouncedPassword) {
      setPasswordChecks({
        length: debouncedPassword.length >= 8,
        uppercase: /[A-Z]/.test(debouncedPassword),
        number: /[0-9]/.test(debouncedPassword),
        specialChar: /[^A-Za-z0-9]/.test(debouncedPassword),
      });
    } else {
      setPasswordChecks({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
      });
    }
  }, [debouncedPassword]);

  const email = form.watch("email");
  const [debouncedEmail] = useDebounce(email, 500);

  const username = form.watch("userName");
  const [debouncedUsername] = useDebounce(username, 500);


  useEffect(() => {
    if (debouncedEmail && z.string().email().safeParse(debouncedEmail).success) {
      setIsCheckingEmail(true);
      const checkEmailAvailability = async () => {
        try {
          const isAvailable = await dispatch(verifyEmail(debouncedEmail));
          setEmailAvailable(isAvailable);
        } catch (error) {
          console.error(error);
          setEmailAvailable(null);
        } finally {
          setIsCheckingEmail(false);
        }
      };
      checkEmailAvailability();
    } else {
      setEmailAvailable(null);
    }
  }, [debouncedEmail, dispatch]);

  // Template for username availability check (replace with actual API call)
  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 4) {
      setIsCheckingUsername(true);
      const checkUsernameAvailability = async () => {
        try {
          const isAvailable = await dispatch(verifyUserName(debouncedUsername));
          setUsernameAvailable(isAvailable);
        } catch (error) {
          console.error(error);
          setUsernameAvailable(null);
        } finally {
          setIsCheckingUsername(false);
        }
      };
      checkUsernameAvailability();
    } else {
      setUsernameAvailable(null);
    }
  }, [debouncedUsername, dispatch]);

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email } = data;
    sessionStorage.setItem("registrationData", JSON.stringify(data));
    const isOtpSent = await dispatch(sendOTP(email));
    if (isOtpSent) {
      router.push("verify");
    }
  };


  if (isCheckingUser) {
    return <Loader/>;
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md text-center p-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Already Logged In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                You are already logged in. <br />
                Please log out if you wish to register with a new account.
              </p>
              <Link href="/dashboard">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/10">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold text-center text-white">
                Create Account
              </CardTitle>
              <p className="text-gray-400 mt-2 text-center">
                Join us today!
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="your@email.com"
                              className="pl-10 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                              {...field}
                            />
                            {isCheckingEmail && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                              </div>
                            )}
                            {!isCheckingEmail && emailAvailable !== null && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {emailAvailable ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                      {!isCheckingEmail && emailAvailable === false && (
                        <p className="text-sm text-red-400">This email is already registered</p>
                      )}
                    </FormItem>
                  )}
                />

                {/* User ID Field */}
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Username</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Choose your username"
                              className="pl-10 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                              {...field}
                            />
                            {isCheckingUsername && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                              </div>
                            )}
                            {!isCheckingUsername && usernameAvailable !== null && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {usernameAvailable ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                      {!isCheckingUsername && usernameAvailable === false && (
                        <p className="text-sm text-red-400">This username is taken</p>
                      )}
                    </FormItem>
                  )}
                />

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Your full name"
                              className="pl-10 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                              {...field}
                            />
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                      {password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center">
                            {passwordChecks.length ? (
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className={`text-sm ${passwordChecks.length ? "text-green-400" : "text-gray-400"}`}>
                              At least 8 characters
                            </span>
                          </div>
                          <div className="flex items-center">
                            {passwordChecks.uppercase ? (
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className={`text-sm ${passwordChecks.uppercase ? "text-green-400" : "text-gray-400"}`}>
                              At least one uppercase letter
                            </span>
                          </div>
                          <div className="flex items-center">
                            {passwordChecks.number ? (
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className={`text-sm ${passwordChecks.number ? "text-green-400" : "text-gray-400"}`}>
                              At least one number
                            </span>
                          </div>
                          <div className="flex items-center">
                            {passwordChecks.specialChar ? (
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className={`text-sm ${passwordChecks.specialChar ? "text-green-400" : "text-gray-400"}`}>
                              At least one special character
                            </span>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className={cn(
                      "w-full bg-indigo-600 hover:bg-indigo-700 text-white",
                      (emailAvailable === false || usernameAvailable === false) && "opacity-80"
                    )}
                    disabled={emailAvailable === false || usernameAvailable === false}
                  >
                    <span className="flex items-center">
                      Register <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </Button>
                </motion.div>
                <LoginWithGoogle/>
              </form>
            </Form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-sm text-gray-400"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-400 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}