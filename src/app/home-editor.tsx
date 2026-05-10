"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface HomeEditorProps {
  defaultCode?: string;
  filename?: string;
}

export function HomeEditor({ defaultCode = "", filename }: HomeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const isEmpty = code.trim().length === 0;

  return (
    <>
      <CodeEditor value={code} onChange={setCode} filename={filename} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-[13px]">
          <Toggle defaultChecked />
          <span className="text-text-primary">roast mode</span>
          <span className="text-text-tertiary">
            {"// maximum sarcasm enabled"}
          </span>
        </div>
        <Button variant="primary" size="md" disabled={isEmpty}>
          $ roast_my_code
        </Button>
      </div>
    </>
  );
}
