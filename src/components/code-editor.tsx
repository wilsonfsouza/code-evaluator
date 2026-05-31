"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { CodeLanguage } from "@/lib/code-languages";
import { highlight } from "@/lib/highlighter";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: CodeLanguage;
  filename?: string;
  placeholder?: string;
  className?: string;
}

const INDENT = "  ";

export function CodeEditor({
  value,
  onChange,
  language,
  filename,
  placeholder,
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [html, setHtml] = useState<string>("");
  const lineCount = Math.max(value.split("\n").length, 1);

  useEffect(() => {
    let cancelled = false;
    highlight(value, language.shikiLang).then((output) => {
      if (!cancelled) setHtml(output);
    });
    return () => {
      cancelled = true;
    };
  }, [value, language.shikiLang]);

  function insertText(textarea: HTMLTextAreaElement, text: string) {
    textarea.focus();
    if (!document.execCommand("insertText", false, text)) {
      const { selectionStart, selectionEnd, value: current } = textarea;
      const next =
        current.slice(0, selectionStart) + text + current.slice(selectionEnd);
      textarea.value = next;
      const caret = selectionStart + text.length;
      textarea.setSelectionRange(caret, caret);
      onChange(next);
    }
  }

  function replaceRange(
    textarea: HTMLTextAreaElement,
    start: number,
    end: number,
    text: string,
    selection: { start: number; end: number },
  ) {
    textarea.focus();
    textarea.setSelectionRange(start, end);
    if (!document.execCommand("insertText", false, text)) {
      const current = textarea.value;
      const next = current.slice(0, start) + text + current.slice(end);
      textarea.value = next;
      onChange(next);
    }
    textarea.setSelectionRange(selection.start, selection.end);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget;

    if (event.key === "Escape") {
      event.preventDefault();
      textarea.blur();
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd, value: current } = textarea;
      const dedent = event.shiftKey;

      const lineStart = current.lastIndexOf("\n", selectionStart - 1) + 1;
      const lineEndIndex = current.indexOf("\n", selectionEnd);
      const lineEnd = lineEndIndex === -1 ? current.length : lineEndIndex;
      const block = current.slice(lineStart, lineEnd);
      const spansMultipleLines = block.includes("\n");

      if (!spansMultipleLines && !dedent) {
        insertText(textarea, INDENT);
        return;
      }

      const lines = block.split("\n");
      const transformed = lines.map((line) => {
        if (dedent) {
          if (line.startsWith(INDENT)) return line.slice(INDENT.length);
          if (line.startsWith(" ")) return line.slice(1);
          if (line.startsWith("\t")) return line.slice(1);
          return line;
        }
        return INDENT + line;
      });
      const replacement = transformed.join("\n");

      const removedFromFirst = lines[0].length - transformed[0].length;
      const removedTotal = block.length - replacement.length;

      const newStart = dedent
        ? Math.max(lineStart, selectionStart - removedFromFirst)
        : selectionStart + INDENT.length;
      const newEnd = dedent
        ? Math.max(newStart, selectionEnd - removedTotal)
        : selectionEnd + INDENT.length * lines.length;

      replaceRange(textarea, lineStart, lineEnd, replacement, {
        start: newStart,
        end: newEnd,
      });
      return;
    }

    if (event.key === "}") {
      const { selectionStart, selectionEnd, value: current } = textarea;
      if (selectionStart !== selectionEnd) return;
      const lineStart = current.lastIndexOf("\n", selectionStart - 1) + 1;
      const linePrefix = current.slice(lineStart, selectionStart);
      if (linePrefix.length >= INDENT.length && /^\s+$/.test(linePrefix)) {
        event.preventDefault();
        textarea.setSelectionRange(
          selectionStart - INDENT.length,
          selectionStart,
        );
        insertText(textarea, "}");
      }
    }
  }

  const displayFilename = filename
    ? `${filename}.${language.extension}`
    : undefined;

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
        {displayFilename && (
          <span className="ml-auto font-mono text-[12px] text-text-tertiary">
            {displayFilename}
          </span>
        )}
      </div>
      <div className="flex font-mono text-[13px] leading-6 [tab-size:2]">
        <div
          aria-hidden
          className="select-none whitespace-pre border-r border-border-primary px-3 py-3 text-right text-text-tertiary"
        >
          {Array.from({ length: lineCount }, (_, i) => i + 1).join("\n")}
        </div>
        <div className="relative grid min-h-[320px] flex-1">
          <div
            aria-hidden
            className="pointer-events-none [grid-area:1/1] overflow-hidden [&_pre]:m-0 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:bg-transparent! [&_pre]:px-3 [&_pre]:py-3 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-6 [&_pre]:[tab-size:2]"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is generated client-side from user input that becomes the textarea value; rendered transparently behind the textarea
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            className={twMerge(
              "[grid-area:1/1] w-full resize-none whitespace-pre-wrap break-words bg-transparent px-3 py-3 font-mono text-[13px] leading-6 caret-text-primary outline-none [tab-size:2] placeholder:text-text-muted",
              html ? "text-transparent" : "text-text-primary",
            )}
          />
        </div>
      </div>
    </div>
  );
}
