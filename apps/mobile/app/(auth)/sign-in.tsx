import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { getClerkRedirectUrl } from '../../src/lib/clerk-auth-session';

type SignInDebugState = {
  attemptStatus: string | null;
  createdSessionId: string | null;
  setActiveCalled: boolean;
  setActiveSucceeded: boolean;
  nextStepHint: string | null;
  clerkError: string | null;
};

type SignInAttemptSummary = {
  status?: string | null;
  createdSessionId?: string | null;
  supportedFirstFactors?: Array<{
    strategy?: string | null;
  }> | null;
};

function formatClerkError(error: unknown) {
  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const clerkErrors = (error as { errors?: unknown }).errors;

    if (Array.isArray(clerkErrors) && clerkErrors.length > 0) {
      return clerkErrors
        .map((issue) => {
          if (typeof issue !== 'object' || issue === null) {
            return String(issue);
          }

          const code =
            'code' in issue && typeof issue.code === 'string'
              ? issue.code
              : 'unknown_code';
          const message =
            'longMessage' in issue && typeof issue.longMessage === 'string'
              ? issue.longMessage
              : 'message' in issue && typeof issue.message === 'string'
                ? issue.message
                : 'Unknown Clerk error';

          return `${code}: ${message}`;
        })
        .join(' | ');
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Falha desconhecida ao autenticar no Clerk.';
  }
}

function buildAttemptDebugState(
  attempt: SignInAttemptSummary,
): SignInDebugState {
  const supportedFirstFactors = Array.isArray(attempt.supportedFirstFactors)
    ? attempt.supportedFirstFactors
        .map((factor) =>
          typeof factor?.strategy === 'string' ? factor.strategy : 'unknown',
        )
        .join(', ')
    : '';

  const nextStepHint =
    attempt.status === 'needs_first_factor'
      ? `supportedFirstFactors=${supportedFirstFactors || 'none'}`
      : attempt.status === 'needs_second_factor'
        ? 'second factor is required before creating a session'
        : null;

  return {
    attemptStatus: attempt.status ?? null,
    createdSessionId:
      typeof attempt.createdSessionId === 'string'
        ? attempt.createdSessionId
        : null,
    setActiveCalled: false,
    setActiveSucceeded: false,
    nextStepHint,
    clerkError: null,
  };
}

export default function SignInScreen() {
  const { isLoaded, setActive, signIn } = useSignIn();
  const router = useRouter();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const redirectUrl = getClerkRedirectUrl();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugState, setDebugState] = useState<SignInDebugState | null>(null);

  async function handleSignIn() {
    if (!isLoaded || !signIn) {
      setErrorMessage('Clerk sign-in resource is not loaded yet.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setDebugState(null);

    try {
      const attempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });
      console.log('Mobile signIn.create result:', {
        status: attempt.status ?? null,
        createdSessionId: attempt.createdSessionId ?? null,
      });
      const nextDebugState = buildAttemptDebugState(attempt);

      setDebugState(nextDebugState);

      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        const incompleteMessage = [
          'Clerk sign-in did not create an active session.',
          `status=${nextDebugState.attemptStatus ?? 'unknown'}`,
          `createdSessionId=${nextDebugState.createdSessionId ?? 'null'}`,
          nextDebugState.nextStepHint,
        ]
          .filter(Boolean)
          .join(' | ');

        setErrorMessage(incompleteMessage);
        return;
      }

      setDebugState((current) =>
        current
          ? {
              ...current,
              setActiveCalled: true,
            }
          : null,
      );
      console.log('Mobile setActive start:', {
        session: attempt.createdSessionId,
      });

      await setActive({
        session: attempt.createdSessionId,
        navigate: async () => {
          console.log('Mobile setActive navigate callback');
          router.replace('/(app)/(tabs)/trucks');
        },
      });
      console.log('Mobile setActive success:', {
        session: attempt.createdSessionId,
      });

      setDebugState((current) =>
        current
          ? {
              ...current,
              setActiveSucceeded: true,
            }
          : null,
      );
    } catch (error) {
      const message = formatClerkError(error);

      console.error('Mobile Clerk sign-in failure:', error);

      setDebugState((current) => ({
        attemptStatus: current?.attemptStatus ?? null,
        createdSessionId: current?.createdSessionId ?? null,
        setActiveCalled: current?.setActiveCalled ?? false,
        setActiveSucceeded: current?.setActiveSucceeded ?? false,
        nextStepHint: current?.nextStepHint ?? null,
        clerkError: message,
      }));

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
        <Text className="mt-3 text-xs leading-5 text-neutral-500">
          {`Hosted redirect URI: ${redirectUrl}`}
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

          {debugState ? (
            <View className="rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-4">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-neutral-500">
                Clerk evidence
              </Text>
              <Text className="mt-2 text-sm leading-6 text-neutral-700">
                {`attempt.status=${debugState.attemptStatus ?? 'null'}`}
              </Text>
              <Text className="text-sm leading-6 text-neutral-700">
                {`createdSessionId=${debugState.createdSessionId ?? 'null'}`}
              </Text>
              <Text className="text-sm leading-6 text-neutral-700">
                {`setActiveCalled=${debugState.setActiveCalled ? 'yes' : 'no'}`}
              </Text>
              <Text className="text-sm leading-6 text-neutral-700">
                {`setActiveSucceeded=${debugState.setActiveSucceeded ? 'yes' : 'no'}`}
              </Text>
              {debugState.nextStepHint ? (
                <Text className="text-sm leading-6 text-neutral-700">
                  {debugState.nextStepHint}
                </Text>
              ) : null}
              {debugState.clerkError ? (
                <Text className="text-sm leading-6 text-neutral-700">
                  {debugState.clerkError}
                </Text>
              ) : null}
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
