import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
} from "shiki";

const TRAILING_NEWLINE_SENTINEL = "​";

let highlighterPromise: Promise<Highlighter> | null = null;
const loadedLanguages = new Set<BundledLanguage>();

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["vesper"],
      langs: [],
    });
  }

  return highlighterPromise;
}

export async function highlight(
  code: string,
  lang: BundledLanguage | null,
): Promise<string> {
  const source = code.endsWith("\n") ? code + TRAILING_NEWLINE_SENTINEL : code;

  if (!lang) {
    return `<pre class="shiki"><code>${escapeHtml(source)}</code></pre>`;
  }

  const highlighter = await getHighlighter();

  if (!loadedLanguages.has(lang)) {
    await highlighter.loadLanguage(lang);
    loadedLanguages.add(lang);
  }

  return highlighter.codeToHtml(source, {
    lang,
    theme: "vesper",
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
