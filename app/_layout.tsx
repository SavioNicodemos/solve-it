import Loading from '@components/Loading';
import {
  Karla_400Regular as Karla400Regular,
  Karla_700Bold as Karla700Bold,
  useFonts,
} from '@expo-google-fonts/karla';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, ToastProvider } from 'native-base';

import { AuthContextProvider } from '@contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AppError } from '@utils/AppError';
import { handleError } from '@utils/handleError';
import THEME from '../src/theme';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_, query) => {
      if (!query.meta?.errorMessage) return;
      handleError(new AppError(query.meta.errorMessage as string));
    },
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({ Karla400Regular, Karla700Bold });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={THEME}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthContextProvider>
              <StatusBar backgroundColor="transparent" translucent />
              {fontsLoaded ? <Slot /> : <Loading />}
            </AuthContextProvider>
          </ToastProvider>
        </QueryClientProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}