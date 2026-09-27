export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function getStatusStyle(status: string): {
  bg: string;
  text: string;
  dot: string;
  border: string;
} {
  switch (status.toLowerCase()) {
    case "scheduled":
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        dot: "bg-blue-500",
        border: "border-blue-200",
      };
    case "waiting":
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        dot: "bg-amber-500",
        border: "border-amber-200",
      };
    case "in consultation":
    case "on route":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        dot: "bg-indigo-500",
        border: "border-indigo-200",
      };
    case "completed":
    case "available":
    case "resolved":
    case "sufficient":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        border: "border-emerald-200",
      };
    case "dispatched":
      return {
        bg: "bg-purple-50",
        text: "text-purple-700",
        dot: "bg-purple-500",
        border: "border-purple-200",
      };
    case "cancelled":
    case "critical":
    case "maintenance":
      return {
        bg: "bg-rose-50",
        text: "text-rose-700",
        dot: "bg-rose-500",
        border: "border-rose-200",
      };
    case "low":
    case "pending":
    case "severe":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        dot: "bg-orange-500",
        border: "border-orange-200",
      };
    default:
      return {
        bg: "bg-slate-100",
        text: "text-slate-700",
        dot: "bg-slate-400",
        border: "border-slate-200",
      };
  }
}

export function getBloodGroupColor(group: string): string {
  if (group.includes("-")) {
    return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
  }
  return "bg-red-50 text-red-700 border-red-200 font-semibold";
}
