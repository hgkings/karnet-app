'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, className }: KPICardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-6',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[13px] font-medium text-[rgba(255,255,255,0.5)]">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn(
              'text-xs font-medium',
              trend === 'up' && 'text-emerald-400',
              trend === 'down' && 'text-red-400',
              trend === 'neutral' && 'text-[rgba(255,255,255,0.4)]',
              !trend && 'text-[rgba(255,255,255,0.4)]'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-primary/8 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
