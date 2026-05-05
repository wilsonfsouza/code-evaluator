import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ScoreRingProps extends ComponentProps<"div"> {
  score: number;
}

export function ScoreRing({ score, className, ...props }: ScoreRingProps) {
  const progress = Math.min(Math.max(score / 10, 0), 1);
  const dash = progress * CIRCUMFERENCE;
  const gap = CIRCUMFERENCE - dash;

  return (
    <div
      {...props}
      className={twMerge("relative h-[180px] w-[180px] shrink-0", className)}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative, score is rendered as accessible text below */}
      <svg width="180" height="180" aria-hidden className="-rotate-90">
        <defs>
          <linearGradient
            id="score-arc-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="var(--color-accent-green)" />
            <stop offset="100%" stopColor="var(--color-accent-amber)" />
          </linearGradient>
        </defs>

        <circle
          cx="90"
          cy="90"
          r={RADIUS}
          strokeWidth="4"
          className="fill-none stroke-border-primary"
        />

        <circle
          cx="90"
          cy="90"
          r={RADIUS}
          strokeWidth="4"
          fill="none"
          stroke="url(#score-arc-gradient)"
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="butt"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[48px] font-bold leading-none text-text-primary">
          {score}
        </span>
        <span className="font-mono text-[16px] font-normal leading-none text-text-tertiary">
          /10
        </span>
      </div>
    </div>
  );
}
