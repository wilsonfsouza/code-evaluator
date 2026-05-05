"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type SwitchRootProps = ComponentProps<typeof Switch.Root>;

interface ToggleProps extends Omit<SwitchRootProps, "className" | "render"> {
  className?: string;
}

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <Switch.Root
      {...props}
      className={twMerge(
        "relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full p-[3px]",
        "bg-border-primary data-[checked]:bg-accent-green",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <Switch.Thumb
        className={twMerge(
          "block h-4 w-4 rounded-full",
          "bg-text-secondary data-[checked]:bg-bg-page",
          "transition-transform duration-150 ease-out",
          "data-[checked]:translate-x-[18px]",
        )}
      />
    </Switch.Root>
  );
}
