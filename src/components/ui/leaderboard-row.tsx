import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

function scoreColorClass(score: number) {
  if (score < 4) return "text-accent-red";
  if (score < 7) return "text-accent-amber";
  return "text-accent-green";
}

interface LeaderboardRowProps extends ComponentProps<"div"> {
  rank: number;
  score: number;
  codePreview: string;
  language: string;
}

export function LeaderboardRow({
  rank,
  score,
  codePreview,
  language,
  className,
  ...props
}: LeaderboardRowProps) {
  return (
    <div
      {...props}
      className={twMerge(
        "flex items-center gap-6 border-b border-border-primary px-5 py-4",
        className,
      )}
    >
      <span className="w-10 shrink-0 font-mono text-[13px] text-text-tertiary">
        #{rank}
      </span>
      <span
        className={twMerge(
          "w-[60px] shrink-0 font-mono text-[13px] font-bold",
          scoreColorClass(score),
        )}
      >
        {score.toFixed(1)}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-text-secondary">
        {codePreview}
      </span>
      <span className="w-[100px] shrink-0 text-right font-mono text-[12px] text-text-tertiary">
        {language}
      </span>
    </div>
  );
}
