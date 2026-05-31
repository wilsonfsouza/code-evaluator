# Code Editor with Syntax Highlight & Language Detection — Design

## Overview

Upgrade the home-page `CodeEditor` from a plain `<textarea>` into a syntax-highlighting editor with automatic language detection and a manual language picker. The editor must remain a single paste-and-type box (no extra editor infrastructure like folding, search, or autocomplete) and visually match `CodeBlock`, which is already rendered with Shiki + the `vesper` theme.

## Research Summary

### How [ray-so](https://github.com/raycast/ray-so) does it

Verified directly against `app/(navigation)/(code)/components/Editor.tsx`, `HighlightedCode.tsx`, and `store/code.ts` in the ray-so repo:

- **Layered editor.** A transparent `<textarea>` is rendered on top of an absolutely-positioned `<div>` containing Shiki-rendered HTML. The textarea captures input; the highlighted layer provides color. Both layers share font, size, leading, and padding so glyphs align pixel-perfectly.
- **Highlighter.** Shiki, in the browser, with `theme: "css-variables"` so themes swap via CSS vars. Grammars load lazily via `highlighter.loadLanguage(src)`.
- **Auto-detection.** `highlight.js`'s `hljs.highlightAuto(input, candidateLanguages)`, stored as `detectedLanguageAtom`. Manual selection (`userInputtedLanguageAtom`) wins when set.
- **Textarea behaviors.** Tab/Shift-Tab indent (2 spaces, multi-line aware), auto-indent on Enter, smart `}` close, Escape to blur. Uses `document.execCommand("insertText", ...)` so the native undo stack survives.

### Alternatives considered

| Option | Why not |
|--------|---------|
| **CodeMirror 6** | Real editor (folding, search, autocomplete), Shiki integration available, ~100-200 KB gzipped. Overkill for a paste-and-roast single textarea, and introduces editor infra we don't need. |
| **Monaco** | VS Code in a page, ~3-5 MB. Far too heavy for this use case. |
| **react-simple-code-editor + Prism** | Tiny (~3 KB + Prism ~20 KB) and ships the same textarea-overlay trick built-in. Prism themes don't match `CodeBlock`'s Vesper aesthetic, so we'd diverge visually inside the same app. |
| **Shiki + custom textarea (ray-so pattern)** | **Chosen.** Shiki is already a dependency, Vesper is already in use, the layered trick is well-trodden. Smallest deviation from the existing codebase. |

### Language-detection alternatives

| Library | Bundle | Accuracy | Notes |
|---------|--------|----------|-------|
| `highlight.js` (`highlightAuto`) | ~50 KB common-langs bundle | Heuristic, ~70-80% on snippets | Mature, what ray-so uses. **Chosen.** |
| `guesslang-js` | ~3 MB (TensorFlow.js + model) | >90% | Too heavy for a single textarea feature. |
| `@vscode/vscode-languagedetection` | ~1 MB | >90% | Node-targeted; ML-based. Same weight problem. |

## Decisions

1. **Approach:** Shiki textarea-overlay (ray-so pattern), `vesper` theme.
2. **Languages (curated, 10):** JavaScript, TypeScript, Python, Java, Go, Ruby, SQL, HTML, CSS, Bash. Easy to expand later.
3. **Detection:** `highlight.js` `highlightAuto` restricted to the curated list, debounced 300 ms on change, only runs when picker is in "Auto" mode.
4. **Picker UX:** Single dropdown. First item is `Auto · <detected>` (e.g. `Auto · typescript`). Selecting any specific language locks it; selecting `Auto` re-enables detection.
5. **Textarea behaviors:** Tab/Shift-Tab indent (2 spaces, multi-line aware), smart `}` close (dedent on whitespace-only line), Esc to blur. **Auto-indent on Enter is out of scope** (explicitly excluded per user choice).
6. **Filename chrome:** Static stem (`paste_here`); extension swaps to match the active language (`paste_here.ts`, `paste_here.py`, …). Falls back to `paste_here.txt` for plaintext / un-detected.
7. **New dependency:** `highlight.js` only.

## Architecture

### Layers inside `CodeEditor`

```
┌──────────────────────────────────────────────────────┐
│  Chrome (traffic lights + filename label)            │  (unchanged)
├──────────────────────────────────────────────────────┤
│  Gutter (line numbers)  │  Code surface              │
│                         │  ┌──────────────────────┐  │
│                         │  │ Highlighted HTML <div>│  │  Layer A (back)
│                         │  │ (Shiki, aria-hidden)  │  │
│                         │  └──────────────────────┘  │
│                         │  ┌──────────────────────┐  │
│                         │  │ <textarea>            │  │  Layer B (front)
│                         │  │ color: transparent    │  │
│                         │  │ caret-color: visible  │  │
│                         │  └──────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

Both layers share font (`font-mono` / JetBrains Mono), size (13px), leading (`leading-6`), padding (`px-3 py-3`), `tab-size: 2`, `white-space: pre-wrap`, `word-break: break-word`. Any drift between them is visible immediately.

### Files

**New:**

- `src/lib/code-languages.ts` — single source of truth for the supported set.
- `src/lib/highlighter.ts` — Shiki singleton + `highlight()` helper (client-only).
- `src/lib/detect-language.ts` — `highlight.js`-backed detector.
- `src/components/ui/language-picker.tsx` — dropdown built on `@base-ui/react` `Menu`.

**Modified:**

- `src/components/code-editor.tsx` — replace textarea-only with the layered editor; accept `language` prop; smart key handling.
- `src/app/home-editor.tsx` — own `selectedId` + `detected` state, run debounced detection, pass `resolved` language to `CodeEditor`.
- `src/app/page.tsx` — single-line prop change: `filename="paste_here.js"` → `filename="paste_here"` (stem only; the editor appends the extension).

**Unchanged:**

- `src/components/ui/code-block.tsx` — unrelated; stays as the async RSC for showing finalized snippets.

## Component Contracts

### `src/lib/code-languages.ts`

```ts
import type { BundledLanguage } from "shiki";

export type CodeLanguageId =
  | "auto"
  | "javascript" | "typescript" | "python" | "java" | "go"
  | "ruby" | "sql" | "html" | "css" | "bash" | "plaintext";

export type CodeLanguage = {
  id: CodeLanguageId;
  label: string;                    // e.g. "TypeScript"
  shikiLang: BundledLanguage | null; // null for "auto" / "plaintext"
  hljsName: string | null;          // name passed to hljs.highlightAuto subset
  extension: string;                // "ts", "py", "sh", "txt"
};

export const AUTO: CodeLanguage;
export const PLAINTEXT: CodeLanguage;
export const CODE_LANGUAGES: readonly CodeLanguage[]; // includes AUTO + 10 langs

export function findById(id: string): CodeLanguage | undefined;
export function findByHljsName(name: string): CodeLanguage | undefined;
```

### `src/lib/highlighter.ts`

```ts
import type { BundledLanguage, Highlighter } from "shiki";

export function getHighlighter(): Promise<Highlighter>; // module-level singleton

export async function highlight(
  code: string,
  lang: BundledLanguage | null,
): Promise<string>;
// - When lang is null → returns HTML-escaped <pre><code>…</code></pre>.
// - Otherwise loads the grammar on demand (cached) then calls codeToHtml with vesper theme.
// - Appends a sentinel newline-marker so a trailing empty line stays visible.
```

### `src/lib/detect-language.ts`

```ts
import type { CodeLanguage } from "./code-languages";

export function detectLanguage(code: string): CodeLanguage;
// - Calls hljs.highlightAuto(code, subset) where subset = curated hljs names.
// - Maps result via findByHljsName. Returns PLAINTEXT on no confident match.
// - Pure / synchronous; the caller debounces.
```

### `src/components/code-editor.tsx` (modified)

```ts
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: CodeLanguage;       // already resolved (never "auto")
  filename?: string;            // stem only; ".{language.extension}" is appended
  placeholder?: string;
  className?: string;
}
```

Internals:

- `const [html, setHtml] = useState<string>("")` — Shiki output.
- `useEffect(() => { let cancelled = false; highlight(value, language.shikiLang).then(h => !cancelled && setHtml(h)); return () => { cancelled = true; }; }, [value, language.shikiLang])`.
- Render the highlighted HTML in `<div aria-hidden dangerouslySetInnerHTML={{ __html: html }} />` (same pattern as `CodeBlock`).
- Render the textarea on top with `color: transparent`, `caret-color: var(--color-text-primary)`, `background: transparent`, matching geometry.
- Keydown handler:
  - **Tab** — `event.preventDefault()`, then `document.execCommand("insertText", false, indented)`. Handles single-cursor and multi-line selection (selects from the start of the first line to the end of the last line, indents/dedents each, restores selection).
  - **Shift-Tab** — same path, dedent mode (`replace(/^\s\s/, "")`).
  - **`}`** — if `selectionStart === selectionEnd` and the current line up to the caret is whitespace-only with ≥2 spaces, set the selection back 2 chars before inserting; otherwise insert normally.
  - **Escape** — `textarea.blur()`.
- Filename label: `{filename}.{language.extension}` when `filename` is set; nothing otherwise.

### `src/components/ui/language-picker.tsx` (new)

```ts
interface LanguagePickerProps {
  value: CodeLanguage;            // currently selected option (AUTO or a specific lang)
  detected: CodeLanguage | null;  // current auto-detect result, if any
  onChange: (lang: CodeLanguage) => void;
}
```

- Built on `@base-ui/react` `Menu` (same family used by existing `Toggle`).
- Trigger label rules:
  - `value === AUTO && detected` → `Auto · {detected.label.toLowerCase()}`
  - `value === AUTO && !detected` → `Auto`
  - otherwise → `value.label.toLowerCase()`
- Items: `Auto` first, then `CODE_LANGUAGES` excluding `AUTO` and `PLAINTEXT`.
- Styled with the project's design tokens: `bg-bg-input`, `border-border-primary`, mono font, terminal aesthetic. No emojis.

### `src/app/home-editor.tsx` (modified)

```tsx
"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { LanguagePicker } from "@/components/ui/language-picker";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  AUTO, PLAINTEXT, findById, type CodeLanguage,
} from "@/lib/code-languages";
import { detectLanguage } from "@/lib/detect-language";

interface HomeEditorProps {
  defaultCode?: string;
  filename?: string; // stem only, e.g. "paste_here"
}

export function HomeEditor({ defaultCode = "", filename }: HomeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [selectedId, setSelectedId] = useState<string>("auto");
  const [detected, setDetected] = useState<CodeLanguage | null>(null);

  const selected = findById(selectedId) ?? AUTO;
  const resolved =
    selected.id === "auto" ? (detected ?? PLAINTEXT) : selected;

  // Debounced detection (only when selectedId === "auto")
  useEffect(() => {
    if (selectedId !== "auto") return;
    if (code.trim().length === 0) { setDetected(null); return; }
    const id = setTimeout(() => setDetected(detectLanguage(code)), 300);
    return () => clearTimeout(id);
  }, [code, selectedId]);

  const isEmpty = code.trim().length === 0;

  return (
    <>
      <CodeEditor
        value={code}
        onChange={setCode}
        language={resolved}
        filename={filename}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-[13px]">
          <Toggle defaultChecked />
          <span className="text-text-primary">roast mode</span>
          <span className="text-text-tertiary">
            {"// maximum sarcasm enabled"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguagePicker
            value={selected}
            detected={detected}
            onChange={(lang) => setSelectedId(lang.id)}
          />
          <Button variant="primary" size="md" disabled={isEmpty}>
            $ roast_my_code
          </Button>
        </div>
      </div>
    </>
  );
}
```

## Data Flow

```
HomeEditor (state owner)
  ├── code, setCode ───────────► CodeEditor (textarea value)
  ├── resolved language ───────► CodeEditor (which Shiki grammar + filename ext)
  ├── selected ────────────────► LanguagePicker (current selection)
  ├── detected ────────────────► LanguagePicker (Auto · <detected> hint)
  └── isEmpty(code) ───────────► Button (disabled)
```

## Edge Cases

- **Highlighter initializing.** First call to `getHighlighter()` is async. Until it resolves, `highlight()` returns escaped plaintext HTML — the editor stays usable, only coloring is missing for the first ~100ms.
- **Lazy grammar load.** When `language.shikiLang` is not yet loaded, `highlight()` awaits `highlighter.loadLanguage(lang)` once, caches the result, then re-renders. No spinner UI.
- **Stale async results.** The highlight `useEffect` uses a `cancelled` flag so an out-of-order Shiki resolution can't overwrite the latest output.
- **Empty / whitespace input.** `detected = null`, picker shows `Auto`, editor renders plaintext, button stays disabled.
- **Detection misses.** `highlightAuto` returns no language, or one outside the curated subset → `PLAINTEXT`. The picker keeps showing just `Auto` (no `· …` suffix).
- **Manual override.** Picking any non-Auto entry locks the language. `detected` still updates internally (cheap) but is ignored by `resolved`. Picking `Auto` again re-runs detection on the current `code` immediately.
- **Trailing newline.** Shiki strips trailing empty lines from rendered HTML. The `highlight()` helper appends a hidden marker so the rendered layer keeps the same line count as the textarea.
- **Tab indent on selection.** When selection spans multiple lines, indent/dedent operates on every line in the selection and restores a selection that covers the modified region (matches ray-so's behavior).
- **Undo stack.** All programmatic insertions use `document.execCommand("insertText", ...)` so Cmd-Z/Cmd-Shift-Z stay correct.

## Performance

- Detection debounced 300ms; only runs in Auto mode.
- Highlighting runs on every `code` / `language` change. `codeToHtml` on snippets <1000 lines is sub-10ms in practice; no debounce planned for v1. If we ever observe jank, we can debounce highlighting too.
- React Compiler (Next 16 default) handles component memoization.
- Shiki highlighter created once per session and cached at module scope.

## Constraints

- `CodeEditor` and `LanguagePicker` are client components. `HomeEditor` is already the `"use client"` boundary; no other component on `page.tsx` needs to flip.
- Vesper theme matches `CodeBlock`; do not introduce a second theme in v1.
- Filename stem now passed without an extension. `page.tsx` must update its prop value from `"paste_here.js"` to `"paste_here"`.
- Named exports only (per project conventions).
- All styling via existing `@theme` tokens; `tv()` only if `LanguagePicker` grows variants (none planned for v1).

## Non-Goals (v1)

- Auto-indent on Enter (explicitly excluded).
- Multi-cursor, find/replace, code folding, autocomplete, IntelliSense, formatting.
- Searchable / virtualized language picker (10 items is fine without it).
- Persisting selected language across reloads.
- Live region announcements for detection changes.
- Server-side rendering of the initial highlight (the home page already streams; the ~100 ms unstyled flash is acceptable).
- A "Detect" button or any UI affordance beyond the dropdown.

## Manual Verification Checklist

No automated test suite exists. Reviewer runs through:

- [ ] `pnpm lint` and `pnpm build` clean.
- [ ] Default `SAMPLE_CODE` loads and is highlighted as JavaScript within ~300 ms.
- [ ] Picker shows `Auto · javascript` on load.
- [ ] Paste a Python snippet → picker switches to `Auto · python`, colors update, filename label becomes `paste_here.py`.
- [ ] Repeat for TypeScript, Java, Go, Ruby, SQL, HTML, CSS, Bash.
- [ ] Manually select TypeScript → label becomes `typescript`, detection stops affecting the rendering even when code changes.
- [ ] Re-select `Auto` → detection resumes; picker updates within ~300 ms.
- [ ] Tab inserts 2 spaces at caret; Shift-Tab dedents.
- [ ] Select 3 lines, press Tab → all 3 indent; Shift-Tab → all 3 dedent; selection survives.
- [ ] Type `}` on a whitespace-only line → 2 spaces are removed before `}` is inserted.
- [ ] Press Esc → textarea loses focus.
- [ ] Clear the editor → picker resets to `Auto` with no `· …` suffix, filename becomes `paste_here.txt`.
- [ ] Cmd-Z / Cmd-Shift-Z move through edit history correctly (including programmatic Tab indents).

## Open Questions

None at spec-time. Anything that surfaces during implementation should be flagged for review.

## Implementation Todos

- [ ] **TODO-1** Add `highlight.js` to dependencies via pnpm. Pin the latest stable version, no `@latest`.
- [ ] **TODO-2** Create `src/lib/code-languages.ts` with `CodeLanguage` type, `AUTO`, `PLAINTEXT`, the 10-entry `CODE_LANGUAGES` array, `findById`, `findByHljsName`.
- [ ] **TODO-3** Create `src/lib/highlighter.ts`: module-level singleton, lazy grammar loading, `highlight(code, lang)` that returns escaped HTML for null and Vesper-highlighted HTML otherwise. Append trailing-newline sentinel.
- [ ] **TODO-4** Create `src/lib/detect-language.ts`: thin wrapper around `hljs.highlightAuto` restricted to the curated subset, mapping result to `CodeLanguage`.
- [ ] **TODO-5** Modify `src/components/code-editor.tsx`: add `language` prop, render layered overlay (highlighted div + transparent textarea), keep existing chrome, render line numbers as today, append `.{extension}` to filename.
- [ ] **TODO-6** Implement textarea keydown handler in `CodeEditor`: Tab/Shift-Tab indent (single + multi-line selection), smart `}` close, Esc blur. All edits via `execCommand("insertText", …)`.
- [ ] **TODO-7** Create `src/components/ui/language-picker.tsx` built on `@base-ui/react` `Menu`. Trigger label per the rules in the spec; items list `Auto` + the 10 languages.
- [ ] **TODO-8** Modify `src/app/home-editor.tsx`: hold `selectedId` + `detected`, run debounced detection in Auto mode only, compute `resolved`, wire `CodeEditor` and `LanguagePicker`.
- [ ] **TODO-9** Update `src/app/page.tsx`: change `filename="paste_here.js"` to `filename="paste_here"` (stem only).
- [ ] **TODO-10** Run the manual verification checklist above. Capture any deviations as follow-ups before merging.
