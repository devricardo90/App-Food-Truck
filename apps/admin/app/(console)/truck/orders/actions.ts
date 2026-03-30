'use server';

import { revalidatePath } from 'next/cache';

import { resolveAdminAuthContext } from '../../../../src/lib/auth-context';
import {
  formatOperationalTargetStatusLabel,
  updateTruckOrderStatus,
} from '../../../../src/lib/orders-api';

export type UpdateTruckOrderActionState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
};

export async function updateTruckOrderStatusAction(
  _previousState: UpdateTruckOrderActionState,
  formData: FormData,
): Promise<UpdateTruckOrderActionState> {
  const orderId = String(formData.get('orderId') ?? '').trim();
  const targetStatus = String(formData.get('targetStatus') ?? '').trim();

  if (!orderId || !targetStatus) {
    return {
      status: 'error',
      message: 'Pedido ou transicao operacional ausente na acao do painel.',
    };
  }

  const authContext = await resolveAdminAuthContext();

  if (authContext.status !== 'ready' || !authContext.data.activeFoodtruck) {
    return {
      status: 'error',
      message:
        'Nao foi possivel resolver a barraca ativa para atualizar o pedido.',
    };
  }

  try {
    await updateTruckOrderStatus(
      authContext.data.activeFoodtruck,
      orderId,
      targetStatus as 'in_progress' | 'ready' | 'completed',
    );

    revalidatePath('/truck/orders');

    return {
      status: 'success',
      message: `Pedido atualizado para ${formatOperationalTargetStatusLabel(targetStatus)} e fila recarregada.`,
    };
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Falha inesperada ao atualizar o status do pedido.',
    };
  }
}
