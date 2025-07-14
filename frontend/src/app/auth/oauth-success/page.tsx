"use client"
import { setCookie } from "@/lib/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";

export default function OAuthSuccess() {
   const  dispatch = useAppDispatch();
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
    dispatch(setCookie(token)).then((success) => {
        if (success) {
          window.location.href = "/dashboard";
        }
      });
    }
  }, [dispatch]);

  return <p>Logging you in...</p>;
}