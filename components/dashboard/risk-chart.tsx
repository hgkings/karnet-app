'use client';

import { Analysis } from '@/types';
import { riskLevelConfig } from '@/utils/risk-engine';
import type { RiskLevel } from '@/types';

interface RiskChartProps {
  analyses: Analysis[];
}

export function RiskChart({ analyses }: RiskChartProps) {
  const counts: Record<RiskLevel, number> = {
    safe: 0,
    moderate: 0,
    risky: 0,
    dangerous: 0,
  };

  analyses.forEach((a) => {
    counts[a.risk.level]++;
  });

  const total = analyses.length || 1;
  const levels: RiskLevel[] = ['safe', 'moderate', 'risky', 'dangerous'];

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="text-sm font-semibold">Risk Dagilimi</h3>
      <div className="mt-6 space-y-4">
        {levels.map((level) => {
          const config = riskLevelConfig[level];
          const pct = (counts[level] / total) * 100;
          return (
            <div key={level} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium" style={{ color: config.color }}>
                  {config.label}
                </span>
                <span className="text-muted-foreground">
                  {counts[level]} urun
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
