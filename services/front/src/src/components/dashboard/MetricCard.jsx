import React from 'react';
import { TrendingUp, TrendingDown, Minus, Target, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function MetricCard({ 
  title, 
  value, 
  meta, 
  prefix = "", 
  suffix = "",
  trend,
  status, // 'success' | 'warning' | 'danger' | null
  subtitle,
  size = "default" // 'default' | 'large'
}) {
  const getStatusIcon = () => {
    if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-amber-500" />;
    if (status === 'danger') return <XCircle className="w-5 h-5 text-red-500" />;
    return null;
  };

  const getStatusBg = () => {
    if (status === 'success') return "bg-emerald-50 border-emerald-200";
    if (status === 'warning') return "bg-amber-50 border-amber-200";
    if (status === 'danger') return "bg-red-50 border-red-200";
    return "bg-white border-slate-200";
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    if (trend === 'stable') return <Minus className="w-4 h-4 text-slate-400" />;
    return null;
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg backdrop-blur-sm",
        getStatusBg()
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-sm text-slate-400">{prefix}</span>}
            <span
              className={cn(
                "font-bold text-slate-800",
                size === "large" ? "text-3xl" : "text-2xl"
              )}
            >
              {value !== undefined && value !== null ? value.toLocaleString('pt-BR') : '-'}
            </span>
            {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusIcon()}
          {getTrendIcon()}
        </div>
      </div>
      {meta !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-slate-500">Meta:</span>
            <span className="text-xs font-semibold text-purple-600">
              {prefix}{meta.toLocaleString('pt-BR')}{suffix}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
