import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const analysisCardHeader = tv({
  slots: {
    root: "flex items-center gap-2",
    dot: "h-2 w-2 shrink-0 rounded-full",
    label: "font-mono text-[12px]",
  },
  variants: {
    severity: {
      critical: { dot: "bg-accent-red", label: "text-accent-red" },
      warning: { dot: "bg-accent-amber", label: "text-accent-amber" },
      good: { dot: "bg-accent-green", label: "text-accent-green" },
    },
  },
  defaultVariants: {
    severity: "critical",
  },
});

type AnalysisCardHeaderVariants = VariantProps<typeof analysisCardHeader>;

interface AnalysisCardHeaderProps
  extends Omit<ComponentProps<"div">, "children">,
    AnalysisCardHeaderVariants {
  children: string;
}

export function AnalysisCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={twMerge(
        "flex flex-col gap-3 border border-border-primary p-5",
        className,
      )}
    />
  );
}

export function AnalysisCardHeader({
  severity,
  className,
  children,
  ...props
}: AnalysisCardHeaderProps) {
  const styles = analysisCardHeader({ severity });
  return (
    <div {...props} className={styles.root({ className })}>
      <span aria-hidden className={styles.dot()} />
      <span className={styles.label()}>{children}</span>
    </div>
  );
}

export function AnalysisCardTitle({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={twMerge(
        "font-mono text-[13px] font-normal text-text-primary",
        className,
      )}
    />
  );
}

export function AnalysisCardDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      {...props}
      className={twMerge(
        "font-mono text-[12px] leading-[1.5] text-text-secondary",
        className,
      )}
    />
  );
}
