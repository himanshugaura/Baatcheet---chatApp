"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { register, sendOTP, verifyOTP } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP must be 6 characters long",
  }),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationProps {
  email: string;
}

export function OtpVerification({ email }: OtpVerificationProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const data = sessionStorage.getItem("registrationData");
  const registerData = data ? JSON.parse(data) : null;

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    const result = await dispatch(sendOTP(email));
    if (result === true) {
      setCountdown(30);
      setIsResending(false);
    } 
  };  

  const onSubmit = async (data: OtpFormValues) => {
    if (isLoading || isVerified) return;

    setIsLoading(true);
    const result = await dispatch(verifyOTP(email, data.otp));
    if (result === true) {
      setIsVerified(true);
      setIsLoading(false);
      dispatch(register(registerData.name, registerData.userName, registerData.email, registerData.password, registerData.confirmPassword));
      sessionStorage.removeItem("registrationData"); 
      setTimeout(() => router.push("login"), 2000);
    } else {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (value.length <= 1) {
      const currentOtp = form.getValues("otp").split("");
      currentOtp[index] = value;
      form.setValue("otp", currentOtp.join(""));

      if (value && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pasteData)) {
      pasteData.split("").forEach((char, index) => {
        const input = inputRefs.current[index];
        if (input) input.value = char;
      });

      form.setValue("otp", pasteData);
      const focusIndex = Math.min(5, pasteData.length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-gray-700 shadow-lg shadow-purple-900/20">
          <CardHeader>
            <button 
              onClick={handleBack}
              className="flex items-center text-sm text-gray-400 hover:text-white mb-2 transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white">
                  {isVerified ? "Verification Complete" : "Verify Your Email"}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isVerified
                    ? "Your email has been successfully verified."
                    : `Enter the 6-digit code sent to ${email}`}
                </CardDescription>
              </div>
              <motion.div
                animate={{ 
                  rotate: isVerified ? 0 : [0, 10, -10, 0],
                  scale: isVerified ? 1 : [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: isVerified ? 0 : Infinity, 
                  repeatDelay: 3,
                  duration: 0.5 
                }}
              >
                <Mail className={`h-8 w-8 ${isVerified ? "text-green-500" : "text-purple-500"}`} />
              </motion.div>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {isVerified ? (
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center space-y-4 py-8"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </motion.div>
                  <p className="text-center text-lg font-medium text-white">
                    Your email has been verified successfully!
                  </p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4"
                  >
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label htmlFor="otp" className="text-gray-300">
                      Verification Code
                    </Label>
                    <motion.div 
                      className="flex justify-center space-x-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ staggerChildren: 0.1 }}
                    >
                      {[...Array(6)].map((_, index) => (
                        <motion.div
                          key={`otp-${index}`}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Input
                            ref={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            className={cn(
                              "h-14 w-14 text-center text-2xl font-semibold bg-gray-700 border-gray-600 text-white",
                              "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                              "transition-all duration-200"
                            )}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
                                inputRefs.current[index - 1]?.focus();
                              }
                            }}
                            onPaste={handlePaste}
                            disabled={isLoading}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                    {form.formState.errors.otp && (
                      <motion.p 
                        className="text-sm font-medium text-red-400"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {form.formState.errors.otp.message}
                      </motion.p>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <span className="text-white">Verify</span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          {!isVerified && (
            <CardFooter className="flex flex-col items-center space-y-3 text-sm">
              <div className="flex items-center text-gray-400">
                <Mail className="mr-2 h-4 w-4" />
                <span>Sent to {email}</span>
              </div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="link"
                  className="h-auto p-0 text-sm text-purple-400 hover:text-purple-300"
                  onClick={handleResend}
                  disabled={countdown > 0 || isResending}
                >
                  {isResending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <motion.span
                      animate={countdown > 0 ? { opacity: [0.6, 1, 0.6] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Resend OTP {countdown > 0 ? `(${countdown}s)` : ""}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}