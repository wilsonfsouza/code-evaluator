import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function scoreColorClass(score: number) {
  if (score < 4) return "text-accent-red";
  if (score < 7) return "text-accent-amber";
  return "text-accent-green";
}

export function LeaderboardRow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={twMerge(
        "flex items-center gap-6 border-b border-border-primary px-5 py-4",
        className,
      )}
    />
  );
}

interface LeaderboardRowRankProps extends ComponentProps<"span"> {
  rank: number;
}

export function LeaderboardRowRank({
  rank,
  className,
  ...props
}: LeaderboardRowRankProps) {
  return (
    <span
      {...props}
      className={twMerge(
        "w-10 shrink-0 font-mono text-[13px] text-text-tertiary",
        className,
      )}
    >
      #{rank}
    </span>
  );
}

interface LeaderboardRowScoreProps extends ComponentProps<"span"> {
  score: number;
}

export function LeaderboardRowScore({
  score,
  className,
  ...props
}: LeaderboardRowScoreProps) {
  return (
    <span
      {...props}
      className={twMerge(
        "w-[60px] shrink-0 font-mono text-[13px] font-bold",
        scoreColorClass(score),
        className,
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}

export function LeaderboardRowCode({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={twMerge(
        "min-w-0 flex-1 truncate font-mono text-[12px] text-text-secondary",
        className,
      )}
    />
  );
}

export function LeaderboardRowLanguage({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={twMerge(
        "w-[100px] shrink-0 text-right font-mono text-[12px] text-text-tertiary",
        className,
      )}
    />
  );
}
