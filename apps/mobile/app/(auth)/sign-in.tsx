import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function SignInScreen() {
  const { isLoaded, setActive, signIn } = useSignIn();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignIn() {
    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const attempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        setErrorMessage('A autenticacao nao concluiu a sessao do cliente.');
        return;
      }

      await setActive({ session: attempt.createdSessionId });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Falha ao autenticar no Clerk.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-sand px-6 pt-20">
      <View className="rounded-[28px] border border-amber-950/10 bg-white p-6 shadow-sm">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-ember">
          Clerk Expo baseline
        </Text>
        <Text className="mt-3 text-3xl font-bold text-ink">
          Login real do cliente com sessao persistente
        </Text>
        <Text className="mt-3 text-base leading-6 text-neutral-600">
          O app usa Clerk para identidade e sessao. O contexto do produto segue
          vindo do backend proprio em `/auth/me`.
        </Text>

        {!publishableKey ? (
          <View className="mt-6 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-4">
            <Text className="text-sm leading-6 text-amber-950">
              Defina `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` para habilitar o fluxo
              real de autenticacao no mobile.
            </Text>
          </View>
        ) : null}

        <View className="mt-8 gap-4">
          <View>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-neutral-500">
              Email
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              className="rounded-[20px] border border-amber-950/10 bg-sand px-4 py-4 text-base text-ink"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
              placeholder="cliente@foodtrucks.app"
              placeholderTextColor="#737373"
              value={emailAddress}
            />
          </View>

          <View>
            <Text className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-neutral-500">
              Senha
            </Text>
            <TextInput
              autoCapitalize="none"
              className="rounded-[20px] border border-amber-950/10 bg-sand px-4 py-4 text-base text-ink"
              onChangeText={setPassword}
              placeholder="Sua senha"
              placeholderTextColor="#737373"
              secureTextEntry
              value={password}
            />
          </View>

          {errorMessage ? (
            <View className="rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-4">
              <Text className="text-sm leading-6 text-rose-900">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Pressable
            className="rounded-full bg-pine px-4 py-4"
            disabled={isSubmitting || !publishableKey}
            onPress={() => {
              void handleSignIn();
            }}
          >
            <Text className="text-center text-sm font-semibold text-white">
              {isSubmitting ? 'Entrando...' : 'Entrar com Clerk'}
            </Text>
          </Pressable>

          <Link asChild href="/(app)/(tabs)/account">
            <Pressable className="rounded-full border border-neutral-300 px-4 py-4">
              <Text className="text-center text-sm font-semibold text-neutral-700">
                Abrir area autenticada minima
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
