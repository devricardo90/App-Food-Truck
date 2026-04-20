'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { AdminTruckOrderStatusAction } from '../lib/orders-api';
import {
  updateTruckOrderStatusAction,
  type UpdateTruckOrderActionState,
} from '../../app/(console)/truck/orders/actions';

const INITIAL_STATE: UpdateTruckOrderActionState = {
  status: 'idle',
  message: null,
};

function SubmitButton({ action }: { action: AdminTruckOrderStatusAction }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="targetStatus"
      value={action.targetStatus}
      disabled={pending}
      className="rounded-lg bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-wait disabled:bg-stone-400"
    >
      {pending ? 'Atualizando fila...' : action.label}
    </button>
  );
}

export function TruckOrderStatusActions({
  orderId,
  actions,
}: {
  orderId: string;
  actions: AdminTruckOrderStatusAction[];
}) {
  const [state, formAction] = useActionState(
    updateTruckOrderStatusAction,
    INITIAL_STATE,
  );

  if (actions.length === 0) {
    return (
      <p className="text-sm leading-6 text-stone-500">
        Nenhuma acao operacional disponivel para o estado atual.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        Acoes operacionais
      </p>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <SubmitButton action={action} key={action.targetStatus} />
        ))}
      </div>
      {state.message ? (
        <div
          className={
            state.status === 'error'
              ? 'rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700'
              : 'rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700'
          }
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}
