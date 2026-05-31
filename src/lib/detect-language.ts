import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { type CodeLanguage, findByHljsName, PLAINTEXT } from "./code-languages";

const SUBSET = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "ruby",
  "sql",
  "xml",
  "css",
  "bash",
];

let registered = false;

function ensureRegistered() {
  if (registered) return;
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("go", go);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("sql", sql);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("bash", bash);
  registered = true;
}

export function detectLanguage(code: string): CodeLanguage {
  ensureRegistered();

  const result = hljs.highlightAuto(code, SUBSET);
  if (!result.language) return PLAINTEXT;

  return findByHljsName(result.language) ?? PLAINTEXT;
}
