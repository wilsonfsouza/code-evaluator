import Link from "next/link";
import { HomeEditor } from "@/app/home-editor";
import { scoreColorClass } from "@/components/ui/leaderboard-row";

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion
}`;

const STATS = { roasted: 2847, average: 4.2 };

const SHAME_ROWS = [
  {
    rank: 1,
    score: 1.2,
    code: 'eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol',
    lang: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    code: "if (x == true) { return true }\nelse if (x == false) { return false }\nelse { return !false }",
    lang: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    code: "SELECT * FROM users WHERE 1=1\n-- TODO: add authentication",
    lang: "sql",
  },
] as const;

export default function Home() {
  return (
    <main>
      <div className="mx-auto max-w-5xl space-y-8 px-10 py-20">
        <header className="space-y-3 text-center">
          <h1 className="font-mono text-4xl text-text-primary">
            <span className="text-accent-green">$</span> paste your code. get
            roasted.
          </h1>
          <p className="font-mono text-sm text-text-secondary">
            {
              "// drop your code below and we'll roast it — brutally honest or full roast mode"
            }
          </p>
        </header>

        <HomeEditor defaultCode={SAMPLE_CODE} filename="paste_here.js" />

        <p className="text-center font-mono text-[12px] text-text-tertiary">
          {STATS.roasted.toLocaleString()} codes roasted
          <span className="mx-3">·</span>
          avg score: {STATS.average.toFixed(1)}/10
        </p>

        <ShameLeaderboard />
      </div>
    </main>
  );
}

function ShameLeaderboard() {
  return (
    <section className="space-y-4 pt-12">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg text-text-primary">
          <span className="text-text-tertiary">{"//"}</span> shame_leaderboard
        </h2>
        <Link
          href="/leaderboard"
          className="font-mono text-xs text-accent-green transition-colors hover:text-emerald-400"
        >
          $ view_all --&gt;
        </Link>
      </div>
      <p className="font-mono text-sm text-text-secondary">
        {"// the worst code on the internet, ranked by shame"}
      </p>

      <div className="overflow-hidden rounded-md border border-border-primary">
        <table className="w-full font-mono text-[13px]">
          <thead className="border-b border-border-primary bg-bg-surface">
            <tr className="text-left text-[11px] uppercase tracking-wider text-text-tertiary">
              <th className="w-12 px-5 py-3 font-normal">#</th>
              <th className="w-20 px-3 py-3 font-normal">score</th>
              <th className="px-3 py-3 font-normal">code</th>
              <th className="w-28 px-5 py-3 text-right font-normal">lang</th>
            </tr>
          </thead>
          <tbody>
            {SHAME_ROWS.map((row, index) => (
              <tr
                key={row.rank}
                className={
                  index === SHAME_ROWS.length - 1
                    ? ""
                    : "border-b border-border-primary"
                }
              >
                <td className="px-5 py-4 align-top text-text-tertiary">
                  {row.rank}
                </td>
                <td
                  className={`px-3 py-4 align-top font-bold ${scoreColorClass(row.score)}`}
                >
                  {row.score.toFixed(1)}
                </td>
                <td className="overflow-hidden px-3 py-4 align-top text-[12px] text-text-secondary">
                  <pre className="whitespace-pre font-mono">{row.code}</pre>
                </td>
                <td className="px-5 py-4 text-right align-top text-[12px] text-text-tertiary">
                  {row.lang}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center font-mono text-[12px] text-text-tertiary">
        showing top {SHAME_ROWS.length} of {STATS.roasted.toLocaleString()}
        <span className="mx-2">·</span>
        <Link
          href="/leaderboard"
          className="text-accent-green transition-colors hover:text-emerald-400"
        >
          view full leaderboard --&gt;
        </Link>
      </p>
    </section>
  );
}
