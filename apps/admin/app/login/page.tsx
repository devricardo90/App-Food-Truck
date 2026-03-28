import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { userId } = await auth();
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (userId) {
    redirect('/truck' as const);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed,transparent_35%),linear-gradient(180deg,#fffbf5_0%,#f7f1e8_100%)] text-stone-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
        <div className="rounded-full border border-amber-900/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700 backdrop-blur">
          Foodtrucks Admin
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="rounded-[2rem] border border-amber-950/10 bg-white/90 p-8 shadow-[0_30px_80px_rgba(146,64,14,0.08)] backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">
              Baseline oficial FT-046
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-stone-950 sm:text-5xl">
              Login real do Clerk com rotas protegidas no Next 16.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-600">
              A identidade e a sessao ficam com o Clerk. O contexto operacional
              continua sendo resolvido pelo backend proprio via contrato
              `/auth/me`.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Area da barraca
                </p>
                <p className="mt-3 text-lg font-semibold text-stone-950">
                  `/truck`
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Operacao local com contexto de foodtruck resolvido no backend.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Area central
                </p>
                <p className="mt-3 text-lg font-semibold text-stone-950">
                  `/central`
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Governanca da plataforma com sessao protegida pela middleware.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-950/10 bg-white/95 p-6 shadow-[0_30px_80px_rgba(6,78,59,0.12)] backdrop-blur">
            {publishableKey ? (
              <SignIn
                appearance={{
                  elements: {
                    card: 'shadow-none border-0 bg-transparent p-0',
                    rootBox: 'w-full',
                  },
                }}
                fallbackRedirectUrl="/truck"
                routing="hash"
              />
            ) : (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
                Defina `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` para habilitar o
                login real do admin.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
