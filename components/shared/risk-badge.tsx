'use client';

import { RiskLevel } from '@/types';
import { riskLevelConfig } from '@/utils/risk-engine';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const config = riskLevelConfig[level];

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
      config.bgColor,
      config.textColor,
      className
    )}>
      {config.label}
    </span>
  );
}
