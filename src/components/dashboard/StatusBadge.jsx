import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function StatusBadge({ status, size = "default" }) {
  const config = {
    saudavel: {
      label: "Saudável",
      icon: CheckCircle2,
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    atencao: {
      label: "Atenção",
      icon: AlertTriangle,
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    critico: {
      label: "Crítico",
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

  const s = config[status] || config.saudavel;
  const Icon = s.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        s.bg,
        s.text,
        s.border,
        size === "large" ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs"
      )}
    >
      <Icon className={cn(size === "large" ? "w-4 h-4" : "w-3 h-3")} />
      {s.label}
    </span>
  );
}
