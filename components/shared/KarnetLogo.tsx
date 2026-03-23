"use client"

interface KarnetLogoProps {
  size?: number
  className?: string
}

export function KarnetLogo({ size = 36, className }: KarnetLogoProps) {
  const r = size / 2
  const innerR = r * 0.8
  const detailR = r * 0.925
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx={r} cy={r} r={r - 2} stroke="#f59e0b" strokeWidth="2.5" />
      <circle cx={r} cy={r} r={innerR} fill="#f59e0b" />
      <circle cx={r} cy={r} r={detailR} stroke="#000" strokeWidth="0.5" opacity="0.15" />
      <text
        x={r}
        y={r * 1.38}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize={size * 0.48}
        fontWeight="800"
        fill="#000"
      >
        K
      </text>
    </svg>
  )
}
