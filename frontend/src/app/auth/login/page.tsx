"use client";

import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
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
import { useAppDispatch } from "@/store/hooks";
import { getUserData, login } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import LoginWithGoogle from "@/components/login/LoginWithGoogle";
import Loader from "@/components/common/Loader";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Enter the password"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const checkUser = async () => {
      await dispatch(getUserData());
      setIsCheckingUser(false);
    };
    checkUser();
  }, [dispatch]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
     const res =  await dispatch(login(values.email, values.password));
     if(res) router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingUser) {
    return (
      <Loader/>
    );
  }

   if (user) {
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
                You are already logged in. Go to your dashboard.
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
                Welcome Back
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="your@email.com"
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
                      <div className="text-right mt-2">
                        <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-indigo-400 hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </FormItem>
                  )}
                />

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "w-full bg-indigo-600 hover:bg-indigo-700 text-white",
                      isSubmitting && "opacity-80"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Logging in...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          Log In <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
                <LoginWithGoogle />
              </form>
            </Form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-sm text-gray-400"
            >
              <p className="inline">Don&apos;t have an account? </p>

              <Link
                href="/auth/register"
                className="font-medium text-indigo-400 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
