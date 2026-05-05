import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  slots: {
    root: "inline-flex items-center gap-2 font-mono",
    dot: "h-2 w-2 rounded-full",
  },
  variants: {
    color: {
      critical: { dot: "bg-accent-red", root: "text-accent-red" },
      warning: { dot: "bg-accent-amber", root: "text-accent-amber" },
      good: { dot: "bg-accent-green", root: "text-accent-green" },
    },
    size: {
      sm: { root: "text-[12px]" },
      md: { root: "text-[13px]" },
    },
  },
  defaultVariants: {
    color: "good",
    size: "sm",
  },
});

type BadgeVariants = VariantProps<typeof badge>;

interface BadgeProps
  extends Omit<ComponentProps<"span">, "color">,
    BadgeVariants {}

export function Badge({
  color,
  size,
  className,
  children,
  ...props
}: BadgeProps) {
  const styles = badge({ color, size });
  return (
    <span {...props} className={styles.root({ className })}>
      <span aria-hidden className={styles.dot()} />
      <span>{children}</span>
    </span>
  );
}
