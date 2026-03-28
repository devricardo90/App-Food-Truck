const surfaceCards = [
  {
    title: 'Operacao da barraca',
    description:
      'Entrada para pedidos, menu, disponibilidade e fila de preparo.',
  },
  {
    title: 'Gestao central',
    description:
      'Area dedicada a eventos, barracas ativas e visibilidade operacional.',
  },
  {
    title: 'Fluxo critico',
    description:
      'Painel preparado para sustentar pedido, pagamento e retirada sem ambiguidade.',
  },
];

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed,transparent_35%),linear-gradient(180deg,#fffbf5_0%,#f7f1e8_100%)] text-stone-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
        <div className="rounded-full border border-amber-900/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 backdrop-blur">
          Foodtrucks Admin
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-[2rem] border border-amber-950/10 bg-white/90 p-8 shadow-[0_30px_80px_rgba(146,64,14,0.08)] backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">
              FT-020 scaffold
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-5xl">
              Base do painel pronta para a operacao de barracas e gestao
              central.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-600">
              Next 16, React 19 e Tailwind 4 entram aqui como fundacao do admin.
              Esta task fecha o scaffold, a estrutura do App Router e o baseline
              visual para os proximos modulos.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white">
                Next 16.2.1
              </span>
              <span className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">
                React 19.2.4
              </span>
              <span className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700">
                Tailwind 4.2.2
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-950/10 bg-emerald-950 p-8 text-white shadow-[0_30px_80px_rgba(6,78,59,0.18)]">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-200">
              Proximas superfícies
            </p>
            <div className="mt-6 space-y-4">
              {surfaceCards.map((card) => (
                <article
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                  key={card.title}
                >
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
