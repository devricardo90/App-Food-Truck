import { resolveAdminAuthContext } from '../../../../src/lib/auth-context';
import {
  fetchTruckOrderQueue,
  formatOrderStatusLabel,
  getOperationalOrderActions,
} from '../../../../src/lib/orders-api';
import { formatAdminPrice } from '../../../../src/lib/foodtrucks-api';
import { ConsoleShell } from '../../../../src/components/console-shell';
import { TruckOrderStatusActions } from '../../../../src/components/truck-order-status-actions';

export default async function TruckOrdersPage() {
  const authContext = await resolveAdminAuthContext();
  const activeFoodtruck =
    authContext.status === 'ready' ? authContext.data.activeFoodtruck : null;

  const queue =
    activeFoodtruck && authContext.status === 'ready'
      ? await fetchTruckOrderQueue(activeFoodtruck).catch(() => null)
      : null;

  return (
    <ConsoleShell
      eyebrow="Operacao"
      title={queue?.activeFoodtruck.foodtruckName ?? 'Fila de pedidos'}
      description={
        queue
          ? `Fila operacional real carregada da API para ${queue.activeFoodtruck.foodtruckName}.`
          : 'Entrada base para lista de pedidos, filtros por estado e acesso ao detalhe operacional.'
      }
      cards={[
        {
          title: 'Aguardando pagamento',
          value: String(queue?.pendingPaymentCount ?? 0),
          hint: 'Checkouts iniciados, mas ainda fora da fila operacional final.',
        },
        {
          title: 'Novos',
          value: String(queue?.newCount ?? 0),
          hint: 'Pedidos confirmados aguardando inicio de preparo.',
        },
        {
          title: 'Em preparo',
          value: String(queue?.inProgressCount ?? 0),
          hint: 'Pedidos com cozinha em andamento.',
        },
      ]}
    >
      {queue ? (
        <section className="grid gap-4">
          <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                  Balcao
                </p>
                <h3 className="mt-2 text-xl font-semibold text-stone-950">
                  Prontos para retirada
                </h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                {queue.readyCount}
              </span>
            </div>
          </article>

          {queue.orders.length > 0 ? (
            queue.orders.map((order) => (
              <article
                className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
                key={order.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                      Pedido {order.publicCode}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-stone-950">
                      {formatOrderStatusLabel(order.status)}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {order.customerName ?? 'Cliente sem nome no dominio'}{' '}
                      {order.customerEmail ? `- ${order.customerEmail}` : ''}
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] bg-stone-50 px-4 py-4 text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                      Total
                    </p>
                    <p className="mt-2 text-lg font-semibold text-stone-950">
                      {formatAdminPrice(order.totalAmount)}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      {new Date(order.createdAt).toLocaleString('sv-SE')}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-stone-200 pt-5">
                  <TruckOrderStatusActions
                    orderId={order.id}
                    actions={getOperationalOrderActions(order.status)}
                  />
                </div>
              </article>
            ))
          ) : (
            <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 text-sm leading-6 text-stone-600 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              Nenhum pedido ativo foi encontrado para a barraca neste momento.
            </article>
          )}
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
          {activeFoodtruck
            ? `Nao foi possivel carregar a fila real de pedidos para ${activeFoodtruck.foodtruckName}.`
            : 'Nenhum foodtruck ativo foi resolvido para carregar a fila operacional.'}
        </section>
      )}
    </ConsoleShell>
  );
}
