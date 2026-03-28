import { resolveAdminAuthContext } from '../../../../src/lib/auth-context';
import {
  fetchFoodtruckCatalog,
  formatAdminPrice,
} from '../../../../src/lib/foodtrucks-api';
import { ConsoleShell } from '../../../../src/components/console-shell';

export default async function TruckMenuPage() {
  const authContext = await resolveAdminAuthContext();
  const activeFoodtruck =
    authContext.status === 'ready' ? authContext.data.activeFoodtruck : null;

  const catalog =
    activeFoodtruck && authContext.status === 'ready'
      ? await fetchFoodtruckCatalog(activeFoodtruck).catch(() => null)
      : null;

  const totalItems =
    catalog?.categories.reduce(
      (total, category) => total + category.items.length,
      0,
    ) ?? 0;
  const activeItems =
    catalog?.categories.reduce(
      (total, category) =>
        total + category.items.filter((item) => item.isAvailable).length,
      0,
    ) ?? 0;
  const pausedItems = totalItems - activeItems;

  return (
    <ConsoleShell
      eyebrow="Catalogo"
      title={catalog?.foodtruckName ?? 'Cardapio da barraca'}
      description={
        catalog
          ? `Catalogo operacional carregado da API para o evento ${catalog.eventSlug}.`
          : 'Base para listar itens, ajustar disponibilidade e entrar na edicao operacional do menu.'
      }
      cards={[
        {
          title: 'Itens ativos',
          value: String(activeItems),
          hint: 'Itens com disponibilidade atual para pedido.',
        },
        {
          title: 'Pausados',
          value: String(pausedItems),
          hint: 'Itens retornados pela API com disponibilidade desativada.',
        },
        {
          title: 'Categorias',
          value: String(catalog?.categories.length ?? 0),
          hint: 'Agrupamentos do catalogo real carregados do backend.',
        },
      ]}
    >
      {catalog ? (
        <section className="grid gap-4">
          {catalog.categories.map((category) => (
            <article
              className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
              key={category.slug}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                {category.name}
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {category.items.map((item) => (
                  <div
                    className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4"
                    key={item.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-stone-950">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {item.description ?? 'Sem descricao cadastrada.'}
                        </p>
                      </div>
                      <span
                        className={
                          item.isAvailable
                            ? 'rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800'
                            : 'rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-800'
                        }
                      >
                        {item.isAvailable ? 'ativo' : 'pausado'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
                      <span>{formatAdminPrice(item.price)}</span>
                      <span>
                        estoque:{' '}
                        {item.dailyStockRemaining === null
                          ? 'livre'
                          : item.dailyStockRemaining}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
          {activeFoodtruck
            ? `Nao foi possivel carregar o catalogo real de ${activeFoodtruck.foodtruckName}.`
            : 'Nenhum foodtruck ativo foi resolvido para carregar o catalogo real.'}
        </section>
      )}
    </ConsoleShell>
  );
}
