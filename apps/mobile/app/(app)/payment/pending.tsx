import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function PaymentPendingScreen() {
  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Pagamento
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Aguardando confirmacao oficial
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        O frontend permanece em estado intermediario ate o backend confirmar o
        pagamento.
      </Text>

      <View className="mt-8 gap-3">
        <Link asChild href="/(app)/orders/order-1024">
          <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
            Reconsultar pedido
          </Text>
        </Link>
        <Link asChild href="/(app)/cart">
          <Text className="rounded-full border border-neutral-300 px-4 py-4 text-center text-sm font-semibold text-neutral-700">
            Voltar ao carrinho
          </Text>
        </Link>
      </View>
    </View>
  );
}
