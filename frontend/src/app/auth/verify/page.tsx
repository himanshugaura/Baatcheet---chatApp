"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OtpVerification } from "@/components/otp-verification";

export default function VerifyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sessionRaw = sessionStorage.getItem("registrationData");
  
    if (!sessionRaw) {
      router.push("/not-found");
      return;
    }
  
    try {
      const sessionData = JSON.parse(sessionRaw);
  
      if (sessionData?.email) {
        setEmail(sessionData.email);
        setIsLoading(false);
      } else {
        router.push("/not-found");
      }
    } catch (err) {
      console.error("Invalid session data:", err);
      router.push("/not-found");
    }
  }, [router]);
  

  if (isLoading) {
    return (
      <h1>loading.. </h1>
    );
  }

  if (!email) {
    router.push("/not-found");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#040617]">
      <OtpVerification 
      email={email}/>
    </div>
  );
}
