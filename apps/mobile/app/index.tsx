import { useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { useUiStore } from '../src/store/ui-store';

const reservationSchema = z.object({
  truckCode: z
    .string()
    .trim()
    .min(2, 'Informe um codigo curto da barraca')
    .max(12, 'Use no maximo 12 caracteres'),
});

type ReservationForm = z.infer<typeof reservationSchema>;

export default function HomeScreen() {
  const highlightedTruck = useUiStore((state) => state.highlightedTruck);
  const setHighlightedTruck = useUiStore((state) => state.setHighlightedTruck);

  const slotsQuery = useQuery({
    queryKey: ['mobile-foundation', 'slots'],
    queryFn: async () => Promise.resolve(['12:00', '12:15', '12:30']),
    staleTime: 60_000,
  });

  const form = useForm<ReservationForm>({
    defaultValues: {
      truckCode: highlightedTruck,
    },
  });

  const errorMessage = form.formState.errors.truckCode?.message;

  const submit = form.handleSubmit((values) => {
    const parsed = reservationSchema.safeParse(values);

    if (!parsed.success) {
      form.setError('truckCode', {
        message: parsed.error.issues[0]?.message ?? 'Codigo invalido',
      });
      return;
    }

    setHighlightedTruck(parsed.data.truckCode.toUpperCase());
  });

  return (
    <View className="flex-1 bg-sand px-6 pt-20">
      <View className="rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
          Foodtrucks MVP
        </Text>
        <Text className="mt-3 text-3xl font-bold text-ink">
          Base mobile pronta para o fluxo do cliente.
        </Text>
        <Text className="mt-3 text-base leading-6 text-neutral-600">
          Router, styling, estado local, server state e formulario tipado ja
          estao conectados.
        </Text>

        <View className="mt-6 rounded-2xl bg-neutral-950 px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-neutral-400">
            Barraca destacada
          </Text>
          <Text className="mt-1 text-2xl font-bold text-white">
            {highlightedTruck}
          </Text>
        </View>

        <View className="mt-6">
          <Text className="mb-2 text-sm font-medium text-neutral-700">
            Codigo rapido da barraca
          </Text>
          <TextInput
            autoCapitalize="characters"
            className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base text-ink"
            onChangeText={(value) => {
              form.clearErrors('truckCode');
              form.setValue('truckCode', value, { shouldDirty: true });
            }}
            onSubmitEditing={submit}
            placeholder="FT01"
            placeholderTextColor="#737373"
            returnKeyType="done"
            value={form.watch('truckCode')}
          />
          {errorMessage ? (
            <Text className="mt-2 text-sm text-red-600">{errorMessage}</Text>
          ) : null}
        </View>

        <View className="mt-6 flex-row items-center gap-3">
          <Text
            className="rounded-full bg-pine px-4 py-3 text-center text-sm font-semibold text-white"
            onPress={submit}
          >
            Atualizar foco
          </Text>
          <Text className="text-sm text-neutral-500">
            Schema validado com Zod e formulario em RHF.
          </Text>
        </View>

        <View className="mt-8 rounded-2xl border border-dashed border-neutral-300 p-4">
          <Text className="text-sm font-semibold text-neutral-800">
            Slots carregados via React Query
          </Text>
          <Text className="mt-2 text-sm text-neutral-600">
            {slotsQuery.data
              ? slotsQuery.data.join(' • ')
              : 'Carregando slots...'}
          </Text>
        </View>
      </View>
    </View>
  );
}
