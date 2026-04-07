"use client";

import * as React from "react";

import { cn } from "../lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/80 p-6 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur",
        className
      )}
      {...props}
    />
  );
}

