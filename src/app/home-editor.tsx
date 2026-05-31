"use client";

import { useEffect, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { LanguagePicker } from "@/components/ui/language-picker";
import { Toggle } from "@/components/ui/toggle";
import {
  AUTO,
  type CodeLanguage,
  findById,
  PLAINTEXT,
} from "@/lib/code-languages";
import { detectLanguage } from "@/lib/detect-language";

interface HomeEditorProps {
  defaultCode?: string;
  filename?: string;
}

export function HomeEditor({ defaultCode = "", filename }: HomeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [selectedId, setSelectedId] = useState<string>("auto");
  const [detected, setDetected] = useState<CodeLanguage | null>(null);

  const selected = findById(selectedId) ?? AUTO;
  const resolved = selected.id === AUTO.id ? (detected ?? PLAINTEXT) : selected;

  useEffect(() => {
    if (selectedId !== AUTO.id) return;
    if (code.trim().length === 0) {
      setDetected(null);
      return;
    }
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
