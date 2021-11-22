import React from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import authMachine from './machines/auth.machine';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Pokedex from './components/Pokedex';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const [state, send] = useMachine(authMachine, { devTools: true });
  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  send('BEGIN_AUTH');
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {state.value === 'authed' && (
          <Pokedex accessToken={state.context.accessToken!} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
