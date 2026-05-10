"use client";

import { twMerge } from "tailwind-merge";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  filename?: string;
  placeholder?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  filename,
  placeholder,
  className,
}: CodeEditorProps) {
  const lineCount = Math.max(value.split("\n").length, 1);

  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-md border border-border-primary bg-bg-input",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent-red" />
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-accent-amber"
        />
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-accent-green"
        />
        {filename && (
          <span className="ml-auto font-mono text-[12px] text-text-tertiary">
            {filename}
          </span>
        )}
      </div>
      <div className="flex font-mono text-[13px] leading-6">
        <div
          aria-hidden
          className="select-none whitespace-pre border-r border-border-primary px-3 py-3 text-right text-text-tertiary"
        >
          {Array.from({ length: lineCount }, (_, i) => i + 1).join("\n")}
        </div>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          className="min-h-[320px] w-full resize-none bg-transparent px-3 py-3 leading-6 text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>
    </div>
  );
}
