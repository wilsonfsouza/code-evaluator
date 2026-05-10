# HomeEditor Component Design

## Overview

Extract the code editor and actions bar from `page.tsx` into a dedicated `HomeEditor` client component. The primary button is disabled when the editor is empty.

## Components

### `CodeEditor` (modified)

- Replace `defaultCode` prop and internal `useState` with `value: string` and `onChange: (value: string) => void` (fully controlled)
- No other changes to structure or styling

### `HomeEditor` (`src/app/home-editor.tsx`)

- `"use client"` directive
- Props: `defaultCode?: string`, `filename?: string`
- State: `const [code, setCode] = useState(defaultCode ?? "")`
- Derived: `const isEmpty = code.trim().length === 0`
- Renders:
  1. `<CodeEditor value={code} onChange={setCode} filename={filename} />`
  2. Actions bar div (toggle + button) — `<Button disabled={isEmpty}>`

### `page.tsx` (modified)

- Remove `<CodeEditor>` and actions bar div
- Add `<HomeEditor defaultCode={SAMPLE_CODE} filename="paste_here.js" />`
- Remove imports for `CodeEditor`, `Button`, `Toggle` (moved to `HomeEditor`)

## Data Flow

```
HomeEditor (state owner)
  ├── code state ──► CodeEditor (value + onChange)
  └── isEmpty     ──► Button (disabled)
```

## Constraints

- `page.tsx` remains a Server Component — `HomeEditor` is the client boundary
- `CodeEditor` becomes fully controlled; callers must supply `value` and `onChange`
- Button disabled check: `code.trim().length === 0`
