import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/login"!</div>;
}

import { ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

type LoginProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function Login({ onSubmit }: LoginProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-entry-background px-5 py-10 text-entry-foreground">
      <div className="w-full max-w-96">
        {/* Cabeçalho */}
        <header className="mb-6 flex items-center gap-3">
          <img
            src={logo}
            alt="Logótipo Bairro Seguro"
            className="size-12 shrink-0 object-contain"
          />

          <div>
            <p className="text-sm font-bold leading-tight">Bairro Seguro</p>
            <p className="mt-1 text-[10px] font-semibold uppercase text-entry-muted">
              Segurança comunitária
            </p>
          </div>
        </header>

        {/* Caixa de Login */}
        <section className="rounded-[24px] border border-entry-border bg-entry-surface px-6 py-6 sm:px-7 sm:py-7">
          <h1 className="font-heading text-xl font-semibold">Entrar com o seu número</h1>

          <p className="mt-2 text-xs leading-relaxed text-entry-muted">
            Sem conta e sem palavra-passe. Esta entrada abre apenas a demonstração do Bairro Seguro.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label
              className="block text-[10px] font-bold uppercase text-entry-muted"
              htmlFor="phone-number"
            >
              Número de telemóvel
              <span className="mt-2 flex h-12 items-center rounded-xl border border-entry-border bg-entry-field px-3 text-sm font-normal normal-case text-entry-muted">
                <span className="shrink-0">+244</span>

                <span className="mx-3 h-5 border-l border-entry-border" />

                <Smartphone className="mr-2 size-4 shrink-0" />

                <input
                  id="phone-number"
                  type="tel"
                  autoComplete="tel-national"
                  placeholder="923 456 789"
                  aria-label="Número de telemóvel"
                  className="min-w-0 flex-1 bg-transparent text-entry-foreground outline-none placeholder:text-entry-muted/70"
                />
              </span>
            </label>

            <Button
              type="submit"
              className="h-11 w-full bg-entry-accent font-semibold text-entry-accent-foreground hover:bg-entry-accent/90"
            >
              Entrar
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-entry-muted">
            Nenhum código é enviado. O número não é verificado nem guardado.
          </p>
        </section>
      </div>
    </main>
  );
}
