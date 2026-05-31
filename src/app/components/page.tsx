import type { ComponentProps, ReactNode } from "react";
import {
  AnalysisCard,
  AnalysisCardDescription,
  AnalysisCardHeader,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import {
  LeaderboardRow,
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default function ComponentsShowcasePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
        <header className="space-y-2">
          <h1 className="font-mono text-2xl text-emerald-500">
            Showcase de Componentes
          </h1>
          <p className="text-sm text-neutral-400">
            Catálogo visual de todos os componentes de UI e suas variantes.
          </p>
        </header>

        <Section
          title="Button"
          description="Botão com 3 variantes e 3 tamanhos."
        >
          <SubSection title="Primary">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </SubSection>

          <SubSection title="Secondary">
            <Button variant="secondary" size="sm">
              Small
            </Button>
            <Button variant="secondary" size="md">
              Medium
            </Button>
            <Button variant="secondary" size="lg">
              Large
            </Button>
          </SubSection>

          <SubSection title="Ghost">
            <Button variant="ghost" size="sm">
              Small
            </Button>
            <Button variant="ghost" size="md">
              Medium
            </Button>
            <Button variant="ghost" size="lg">
              Large
            </Button>
          </SubSection>

          <SubSection title="Disabled">
            <Button variant="primary" disabled>
              Primary
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="ghost" disabled>
              Ghost
            </Button>
          </SubSection>
        </Section>

        <Section
          title="Toggle"
          description="Switch (base-ui) com estados ligado, desligado e desabilitado."
        >
          <SubSection title="Off">
            <Toggle />
          </SubSection>

          <SubSection title="On">
            <Toggle defaultChecked />
          </SubSection>

          <SubSection title="Disabled">
            <Toggle disabled />
            <Toggle defaultChecked disabled />
          </SubSection>
        </Section>

        <Section
          title="Badge"
          description="Indicador de status com 3 cores e 2 tamanhos."
        >
          <SubSection title="Critical">
            <Badge color="critical">critical</Badge>
            <Badge color="critical" size="md">
              needs_serious_help
            </Badge>
          </SubSection>

          <SubSection title="Warning">
            <Badge color="warning">warning</Badge>
            <Badge color="warning" size="md">
              minor_issue
            </Badge>
          </SubSection>

          <SubSection title="Good">
            <Badge color="good">good</Badge>
            <Badge color="good" size="md">
              all_clear
            </Badge>
          </SubSection>
        </Section>

        <Section
          title="CodeBlock"
          description="Bloco de código (Server Component) com Shiki + tema vesper."
        >
          <SubSection title="Com filename">
            <div className="w-full max-w-2xl">
              <CodeBlock
                code={sampleCode}
                lang="javascript"
                filename="calculate.js"
              />
            </div>
          </SubSection>

          <SubSection title="Sem filename">
            <div className="w-full max-w-2xl">
              <CodeBlock code={sampleCode} lang="javascript" />
            </div>
          </SubSection>
        </Section>

        <Section
          title="DiffLine"
          description="Linha de diff com variantes added, removed e context."
        >
          <SubSection title="Diff sample">
            <div className="w-full max-w-2xl overflow-hidden rounded-md border border-border-primary">
              <DiffLine kind="context">
                for (let i = 0; i &lt; items.length; i++) &#123;
              </DiffLine>
              <DiffLine kind="removed">var total = 0;</DiffLine>
              <DiffLine kind="added">const total = 0;</DiffLine>
              <DiffLine kind="context">&#125;</DiffLine>
            </div>
          </SubSection>
        </Section>

        <Section
          title="ScoreRing"
          description="Anel circular de progresso com gradiente, tamanho fixo 180px."
        >
          <SubSection title="Scores">
            <ScoreRing score={2.1} />
            <ScoreRing score={5.0} />
            <ScoreRing score={8.5} />
          </SubSection>
        </Section>

        <Section
          title="AnalysisCard"
          description="Card de análise com severidade via composição."
        >
          <SubSection title="Critical">
            <AnalysisCard className="max-w-md">
              <AnalysisCardHeader severity="critical">
                critical
              </AnalysisCardHeader>
              <AnalysisCardTitle>
                using var instead of const/let
              </AnalysisCardTitle>
              <AnalysisCardDescription>
                the var keyword is function-scoped rather than block-scoped,
                which can lead to unexpected behavior and bugs. modern
                javascript uses const for immutable bindings and let for mutable
                ones.
              </AnalysisCardDescription>
            </AnalysisCard>
          </SubSection>

          <SubSection title="Warning">
            <AnalysisCard className="max-w-md">
              <AnalysisCardHeader severity="warning">
                warning
              </AnalysisCardHeader>
              <AnalysisCardTitle>missing error handling</AnalysisCardTitle>
              <AnalysisCardDescription>
                async functions should handle rejected promises. wrap the await
                call in a try/catch block or chain a .catch() handler to avoid
                unhandled promise rejection errors at runtime.
              </AnalysisCardDescription>
            </AnalysisCard>
          </SubSection>

          <SubSection title="Good">
            <AnalysisCard className="max-w-md">
              <AnalysisCardHeader severity="good">good</AnalysisCardHeader>
              <AnalysisCardTitle>
                destructuring used correctly
              </AnalysisCardTitle>
              <AnalysisCardDescription>
                object destructuring keeps the code concise and makes the intent
                of the variable bindings explicit. no issues found here.
              </AnalysisCardDescription>
            </AnalysisCard>
          </SubSection>
        </Section>

        <Section
          title="LeaderboardRow"
          description="Linha de tabela de ranking com rank, score, prévia de código e linguagem."
        >
          <SubSection title="Tabela">
            <div className="w-full overflow-hidden rounded-md border border-border-primary">
              <LeaderboardRow>
                <LeaderboardRowRank rank={1} />
                <LeaderboardRowScore score={2.1} />
                <LeaderboardRowCode>
                  {
                    "function calculateTotal(items) { var total = 0; for (var i = 0; i < items.length; i++) { total += items[i].price; } return total; }"
                  }
                </LeaderboardRowCode>
                <LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
              </LeaderboardRow>
              <LeaderboardRow>
                <LeaderboardRowRank rank={2} />
                <LeaderboardRowScore score={5.3} />
                <LeaderboardRowCode>
                  {
                    "export default function handler(req, res) { const data = fetchData(); res.json(data); }"
                  }
                </LeaderboardRowCode>
                <LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
              </LeaderboardRow>
              <LeaderboardRow className="border-b-0">
                <LeaderboardRowRank rank={3} />
                <LeaderboardRowScore score={8.7} />
                <LeaderboardRowCode>
                  const sum = (a, b) =&gt; a + b
                </LeaderboardRowCode>
                <LeaderboardRowLanguage>python</LeaderboardRowLanguage>
              </LeaderboardRow>
            </div>
          </SubSection>
        </Section>
      </div>
    </main>
  );
}

interface SectionProps extends ComponentProps<"section"> {
  title: string;
  description?: string;
  children: ReactNode;
}

function Section({ title, description, children, ...props }: SectionProps) {
  return (
    <section className="space-y-6" {...props}>
      <div className="space-y-1 border-b border-neutral-800 pb-3">
        <h2 className="font-mono text-lg text-neutral-100">{title}</h2>
        {description && (
          <p className="text-xs text-neutral-500">{description}</p>
        )}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

interface SubSectionProps extends ComponentProps<"div"> {
  title: string;
  children: ReactNode;
}

function SubSection({ title, children, ...props }: SubSectionProps) {
  return (
    <div className="space-y-3" {...props}>
      <h3 className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        {title}
      </h3>
      <div className="flex flex-wrap items-center gap-4 rounded-md bg-neutral-900/40 p-6 ring-1 ring-neutral-800/60">
        {children}
      </div>
    </div>
  );
}
