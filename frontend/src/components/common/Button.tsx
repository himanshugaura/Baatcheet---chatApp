import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClickLink?: string; 
}

export const Button = ({
  active = false,
  children,
  className,
  variant = "primary",
  size = "md",
  onClickLink,
  onClick,
  ...props
}: ButtonProps) => {
  const baseClasses = "rounded-lg font-medium transition-all duration-300 hover:scale-95 cursor-pointer";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variantClasses = {
    primary: active
      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30 "
      : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-300",
    secondary: active
      ? "bg-white text-black shadow-lg hover:bg-gray-100 focus:ring-white"
      : "bg-transparent text-gray-400 border border-gray-700 hover:bg-gray-800 hover:text-gray-300"
  };

  // If onClickLink is provided, wrap the button in a Link component
  if (onClickLink) {
    return (
     <Link href={onClickLink}>
  <button
    className={cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      "hover:bg-position-100",
      className
    )}
    onClick={onClick}
    {...props}
  >
    <div className="flex items-center gap-2 justify-center">{children}</div>
  </button>
</Link>

    );
  }

  return (
   <button
  className={cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    "hover:bg-position-100",
    className
  )}
  onClick={onClick}
  {...props}
>
  <div className="flex items-center gap-2 justify-center">{children}</div> 
</button>

  );
};