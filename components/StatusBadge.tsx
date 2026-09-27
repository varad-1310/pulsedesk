import React from "react";
import { getStatusStyle } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusBadge({
  status,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const style = getStatusStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${
        style.bg
      } ${style.text} ${style.border} ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs"
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
