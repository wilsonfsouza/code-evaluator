import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border-primary bg-bg-page">
      <div className="flex h-14 items-center justify-between px-10">
        <Link
          href="/"
          className="font-mono text-[13px] text-text-primary transition-colors hover:text-text-primary"
        >
          <span className="text-accent-green">&gt;</span> devroast
        </Link>
        <Link
          href="/leaderboard"
          className="font-mono text-[13px] text-text-secondary transition-colors hover:text-text-primary"
        >
          leaderboard
        </Link>
      </div>
    </header>
  );
}
