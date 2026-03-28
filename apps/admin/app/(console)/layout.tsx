import type { Route } from 'next';
import Link from 'next/link';

type ConsoleLayoutProps = {
  children: React.ReactNode;
};

const truckNav = [
  { href: '/truck' as Route, label: 'Dashboard' },
  { href: '/truck/orders' as Route, label: 'Pedidos' },
  { href: '/truck/menu' as Route, label: 'Cardapio' },
  { href: '/truck/settings' as Route, label: 'Configuracoes' },
];

const centralNav = [
  { href: '/central' as Route, label: 'Dashboard' },
  { href: '/central/trucks' as Route, label: 'Barracas' },
  { href: '/central/access' as Route, label: 'Acessos' },
  { href: '/central/support' as Route, label: 'Suporte' },
];

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="grid min-h-screen lg:grid-cols-[280px,1fr]">
        <aside className="border-r border-stone-200 bg-stone-950 px-6 py-8 text-white">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Foodtrucks Admin
            </p>
            <p className="mt-3 text-lg font-semibold">
              Layout autenticado base
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Navegacao separada por contexto para evitar mistura entre barraca
              e area central.
            </p>
          </div>

          <nav className="mt-8 space-y-8">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                Area da barraca
              </p>
              <div className="mt-3 space-y-2">
                {truckNav.map((item) => (
                  <Link
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-200 transition hover:bg-white/10"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                Area central
              </p>
              <div className="mt-3 space-y-2">
                {centralNav.map((item) => (
                  <Link
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-stone-200 transition hover:bg-white/10"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>
          </nav>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-stone-200 bg-white/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                  Sessao autenticada
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                  Painel de operacao do MVP
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  Ambiente local
                </span>
                <Link
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"
                  href={'/login' as const}
                >
                  Trocar contexto
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
