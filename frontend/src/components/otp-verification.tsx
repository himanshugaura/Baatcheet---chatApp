"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { register, sendOTP, verifyOTP } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";

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
        dispatch(register(registerData.name , registerData.userName ,  registerData.email , registerData.password , registerData.confirmPassword));
        sessionStorage.removeItem("registerData"); 
        router.push("login")
      }
      else
      {
        setIsLoading(false)
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isVerified ? "Verification Complete" : "Verify Your Email"}
        </CardTitle>
        <CardDescription>
          {isVerified
            ? "Your email has been successfully verified."
            : `Enter the 6-digit code sent to ${email}`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isVerified ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-center text-lg font-medium">
              Your email has been verified successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center space-x-2">
                {[...Array(6)].map((_, index) => (
                  <Input
                  key={`otp-${index}`}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  className="h-14 w-14 text-center text-2xl font-semibold"
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
                      inputRefs.current[index - 1]?.focus();
                    }
                  }}
                  onPaste={handlePaste}
                  disabled={isLoading}
                />
         
                ))}
              </div>
              {form.formState.errors.otp && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        )}
      </CardContent>

      {!isVerified && (
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Mail className="mr-2 h-4 w-4" />
            <span>Sent to {email}</span>
          </div>
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
          >
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Resend OTP {countdown > 0 ? `(${countdown}s)` : ""}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
