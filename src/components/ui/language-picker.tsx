"use client";

import { Menu } from "@base-ui/react/menu";
import {
  AUTO,
  CODE_LANGUAGES,
  type CodeLanguage,
  PLAINTEXT,
} from "@/lib/code-languages";

interface LanguagePickerProps {
  value: CodeLanguage;
  detected: CodeLanguage | null;
  onChange: (lang: CodeLanguage) => void;
}

const PICKABLE = CODE_LANGUAGES.filter(
  (lang) => lang.id !== AUTO.id && lang.id !== PLAINTEXT.id,
);

function triggerLabel(value: CodeLanguage, detected: CodeLanguage | null) {
  if (value.id === AUTO.id) {
    return detected ? `Auto · ${detected.label.toLowerCase()}` : "Auto";
  }
  return value.label.toLowerCase();
}

export function LanguagePicker({
  value,
  detected,
  onChange,
}: LanguagePickerProps) {
  return (
    <Menu.Root>
      <Menu.Trigger className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border-primary bg-bg-input px-3 font-mono text-[13px] text-text-primary outline-none transition-colors hover:border-text-tertiary focus-visible:border-accent-green data-[popup-open]:border-accent-green">
        <span className="text-text-tertiary">{"//"}</span>
        <span>{triggerLabel(value, detected)}</span>
        <span aria-hidden className="text-text-tertiary">
          {"▾"}
        </span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end">
          <Menu.Popup className="min-w-[180px] origin-[var(--transform-origin)] rounded-md border border-border-primary bg-bg-elevated p-1 font-mono text-[13px] text-text-primary shadow-lg outline-none">
            <Menu.Item
              onClick={() => onChange(AUTO)}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-bg-input"
            >
              <span>Auto</span>
              {value.id === AUTO.id && (
                <span className="text-accent-green">{"●"}</span>
              )}
            </Menu.Item>
            {PICKABLE.map((lang) => (
              <Menu.Item
                key={lang.id}
                onClick={() => onChange(lang)}
                className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 outline-none data-[highlighted]:bg-bg-input"
              >
                <span>{lang.label.toLowerCase()}</span>
                {value.id === lang.id && (
                  <span className="text-accent-green">{"●"}</span>
                )}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
