import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
  slots: {
    root: "flex w-full items-start gap-2 px-4 py-2 font-mono text-[13px]",
    prefix: "shrink-0 select-none",
    code: "whitespace-pre-wrap break-all",
  },
  variants: {
    kind: {
      added: {
        root: "bg-diff-added-bg",
        prefix: "text-accent-green",
        code: "text-text-primary",
      },
      removed: {
        root: "bg-diff-removed-bg",
        prefix: "text-accent-red",
        code: "text-text-secondary",
      },
      context: {
        prefix: "text-text-tertiary",
        code: "text-text-secondary",
      },
    },
  },
  defaultVariants: {
    kind: "context",
  },
});

const prefixGlyph = {
  added: "+",
  removed: "-",
  context: " ",
} as const;

type DiffLineVariants = VariantProps<typeof diffLine>;

interface DiffLineProps extends ComponentProps<"div">, DiffLineVariants {}

export function DiffLine({
  kind = "context",
  className,
  children,
  ...props
}: DiffLineProps) {
  const styles = diffLine({ kind });
  return (
    <div {...props} className={styles.root({ className })}>
      <span aria-hidden className={styles.prefix()}>
        {prefixGlyph[kind ?? "context"]}
      </span>
      <span className={styles.code()}>{children}</span>
    </div>
  );
}
