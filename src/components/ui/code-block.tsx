import { type BundledLanguage, codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

interface CodeBlockProps {
  code: string;
  lang: BundledLanguage;
  filename?: string;
  className?: string;
}

export async function CodeBlock({
  code,
  lang,
  filename,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

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
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output is server-rendered, trusted HTML
        dangerouslySetInnerHTML={{ __html: html }}
        className="code-block-body font-mono text-[13px] [&_pre]:bg-transparent! [&_pre]:overflow-x-auto [&_pre]:p-3 [&_code]:[counter-reset:line] [&_.line]:before:[counter-increment:line] [&_.line]:before:[content:counter(line)] [&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-6 [&_.line]:before:text-right [&_.line]:before:text-text-tertiary"
      />
    </div>
  );
}
