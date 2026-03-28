import type { Route } from 'next';
import Link from 'next/link';

const accessCards = [
  {
    href: '/truck' as Route,
    eyebrow: 'truck_operator / truck_manager',
    title: 'Entrar na area da barraca',
    description:
      'Fila operacional, cardapio, disponibilidade e controles locais.',
  },
  {
    href: '/central' as Route,
    eyebrow: 'platform_admin',
    title: 'Entrar na area central',
    description:
      'Governanca da plataforma, barracas, acessos e suporte operacional.',
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed,transparent_35%),linear-gradient(180deg,#fffbf5_0%,#f7f1e8_100%)] text-stone-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
        <div className="rounded-full border border-amber-900/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 backdrop-blur">
          Foodtrucks Admin
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-[2rem] border border-amber-950/10 bg-white/90 p-8 shadow-[0_30px_80px_rgba(146,64,14,0.08)] backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">
              FT-021 UI base
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-5xl">
              Entrada autenticada com contextos separados para barraca e gestao
              central.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-600">
              Este ponto organiza o painel para que cada role caia no contexto
              correto, com navegacao distinta, leitura rapida e sem mistura
              entre operacao da barraca e governanca central.
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-950/10 bg-emerald-950 p-8 text-white shadow-[0_30px_80px_rgba(6,78,59,0.18)]">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-200">
              Contextos de acesso
            </p>
            <div className="mt-6 space-y-4">
              {accessCards.map((card) => (
                <Link
                  className="block rounded-[1.5rem] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                  href={card.href}
                  key={card.href}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
                    {card.eyebrow}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
