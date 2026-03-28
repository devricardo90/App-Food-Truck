import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function CheckoutScreen() {
  return (
    <View className="flex-1 bg-sand px-6 pt-16">
      <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
        Checkout
      </Text>
      <Text className="mt-3 text-3xl font-bold text-ink">
        Confirmacao final do pedido
      </Text>
      <Text className="mt-3 text-base leading-6 text-neutral-600">
        Esta tela prepara o handoff para pagamento sem promover o pedido para
        confirmado por conta propria.
      </Text>

      <View className="mt-8 rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-base text-neutral-700">
          Revisao final de itens, retirada e estado do pagamento.
        </Text>
      </View>

      <View className="mt-8 gap-3">
        <Link asChild href="/(app)/payment/pending">
          <Text className="rounded-full bg-pine px-4 py-4 text-center text-sm font-semibold text-white">
            Iniciar pagamento
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
