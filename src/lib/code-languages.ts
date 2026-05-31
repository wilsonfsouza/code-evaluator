import type { BundledLanguage } from "shiki";

export type CodeLanguageId =
  | "auto"
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "ruby"
  | "sql"
  | "html"
  | "css"
  | "bash"
  | "plaintext";

export type CodeLanguage = {
  id: CodeLanguageId;
  label: string;
  shikiLang: BundledLanguage | null;
  hljsName: string | null;
  extension: string;
};

export const AUTO: CodeLanguage = {
  id: "auto",
  label: "Auto",
  shikiLang: null,
  hljsName: null,
  extension: "txt",
};

export const PLAINTEXT: CodeLanguage = {
  id: "plaintext",
  label: "Plain text",
  shikiLang: null,
  hljsName: null,
  extension: "txt",
};

const LANGUAGES: readonly CodeLanguage[] = [
  {
    id: "javascript",
    label: "JavaScript",
    shikiLang: "javascript",
    hljsName: "javascript",
    extension: "js",
  },
  {
    id: "typescript",
    label: "TypeScript",
    shikiLang: "typescript",
    hljsName: "typescript",
    extension: "ts",
  },
  {
    id: "python",
    label: "Python",
    shikiLang: "python",
    hljsName: "python",
    extension: "py",
  },
  {
    id: "java",
    label: "Java",
    shikiLang: "java",
    hljsName: "java",
    extension: "java",
  },
  {
    id: "go",
    label: "Go",
    shikiLang: "go",
    hljsName: "go",
    extension: "go",
  },
  {
    id: "ruby",
    label: "Ruby",
    shikiLang: "ruby",
    hljsName: "ruby",
    extension: "rb",
  },
  {
    id: "sql",
    label: "SQL",
    shikiLang: "sql",
    hljsName: "sql",
    extension: "sql",
  },
  {
    id: "html",
    label: "HTML",
    shikiLang: "html",
    hljsName: "xml",
    extension: "html",
  },
  {
    id: "css",
    label: "CSS",
    shikiLang: "css",
    hljsName: "css",
    extension: "css",
  },
  {
    id: "bash",
    label: "Bash",
    shikiLang: "bash",
    hljsName: "bash",
    extension: "sh",
  },
];

export const CODE_LANGUAGES: readonly CodeLanguage[] = [AUTO, ...LANGUAGES];

export function findById(id: string): CodeLanguage | undefined {
  if (id === PLAINTEXT.id) return PLAINTEXT;
  return CODE_LANGUAGES.find((lang) => lang.id === id);
}

export function findByHljsName(name: string): CodeLanguage | undefined {
  return LANGUAGES.find((lang) => lang.hljsName === name);
}
