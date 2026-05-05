import type { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "inline-flex items-center justify-center gap-2",
    "font-mono font-medium",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    variant: {
      primary:
        "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 active:bg-emerald-600",
      secondary:
        "bg-neutral-900 text-emerald-500 ring-1 ring-emerald-500/30 hover:bg-neutral-800",
      ghost: "bg-transparent text-emerald-500 hover:bg-emerald-500/10",
    },
    size: {
      sm: "px-4 py-1.5 text-xs",
      md: "px-6 py-2.5 text-[13px]",
      lg: "px-8 py-3 text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={button({ variant, size, className })}
      {...props}
    />
  );
}
