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

  let queue = null;
  let queueErrorMessage: string | null = null;

  if (activeFoodtruck && authContext.status === 'ready') {
    try {
      queue = await fetchTruckOrderQueue(activeFoodtruck);
    } catch (error) {
      queueErrorMessage =
        error instanceof Error
          ? error.message
          : `Nao foi possivel carregar a fila real de pedidos para ${activeFoodtruck.foodtruckName}.`;
    }
  }

  const hasOperationalOrders =
    (queue?.newCount ?? 0) +
      (queue?.inProgressCount ?? 0) +
      (queue?.readyCount ?? 0) >
    0;

  return (
    <ConsoleShell
      eyebrow="Operacao"
      title={queue?.activeFoodtruck.foodtruckName ?? 'Fila de pedidos'}
      description={
        queue
          ? `Fila real em staging para ${queue.activeFoodtruck.foodtruckName}, com transicoes operacionais controladas.`
          : 'Fila da barraca, contadores por estado e acoes permitidas pelo contrato do pedido.'
      }
      cards={[
        {
          title: 'Aguardando pagamento',
          value: String(queue?.pendingPaymentCount ?? 0),
          hint: 'Checkouts criados, ainda fora da operacao da barraca.',
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
        {
          title: 'Prontos',
          value: String(queue?.readyCount ?? 0),
          hint: 'Pedidos liberados para retirada no balcao.',
        },
      ]}
    >
      {queue ? (
        <section className="grid gap-4">
          <article className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">
                  Balcao de retirada
                </p>
                <h3 className="mt-2 text-xl font-semibold text-emerald-950">
                  {queue.readyCount} pedido(s) prontos
                </h3>
              </div>
              <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-900">
                Staging
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-emerald-900">
              A tela revalida a fila apos cada mutacao. Pedidos so entram na
              operacao depois da confirmacao de pagamento.
            </p>
          </article>

          {queue.orders.length > 0 ? (
            queue.orders.map((order) => (
              <article
                className="rounded-lg border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
                key={order.id}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-800">
                      Pedido {order.publicCode}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-stone-950">
                      {formatOrderStatusLabel(order.status)}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {order.customerName ?? 'Cliente sem nome no dominio'}{' '}
                      {order.customerEmail ? `- ${order.customerEmail}` : ''}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">
                      Estado operacional atual: {order.status}
                    </p>
                  </div>

                  <div className="rounded-lg bg-stone-50 px-4 py-4 text-right">
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
          ) : hasOperationalOrders ? (
            <article className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              A fila retornou contadores operacionais, mas nenhum pedido foi
              listado. Recarregue a tela ou repita a consulta para confirmar a
              consistencia da fila.
            </article>
          ) : (
            <article className="rounded-lg border border-stone-200 bg-white p-6 text-sm leading-6 text-stone-600 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
              Nenhum pedido operacional foi encontrado para a barraca neste
              momento. Quando novos pedidos entrarem em `new`, `in_progress` ou
              `ready`, as acoes aparecerao aqui.
            </article>
          )}
        </section>
      ) : (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
          <p className="font-semibold">
            {activeFoodtruck
              ? `Nao foi possivel carregar a fila real de pedidos para ${activeFoodtruck.foodtruckName}.`
              : 'Nenhum foodtruck ativo foi resolvido para carregar a fila operacional.'}
          </p>
          {queueErrorMessage ? (
            <p className="mt-3 text-sm leading-6 text-amber-900">
              Detalhe: {queueErrorMessage}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-amber-900">
            Revise a sessao do painel, o contexto ativo da barraca e a
            disponibilidade da API antes de repetir a consulta.
          </p>
        </section>
      )}
    </ConsoleShell>
  );
}
