"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition",
        variant === "default" &&
          "bg-violet-600 text-white hover:bg-violet-500",
        variant === "secondary" &&
          "bg-zinc-900 text-white hover:bg-zinc-800",
        variant === "ghost" &&
          "bg-transparent text-zinc-700 hover:bg-zinc-100",
        className
      )}
      {...props}
    />
  );
}

