import React from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import authMachine from './machines/auth.machine';

function App() {
  const [_state, send] = useMachine(authMachine, { devTools: true });
  send('BEGIN_AUTH');
  return (
    <div>
      <pre>{JSON.stringify(_state.context)}</pre>
      <pre>{JSON.stringify(_state.value)}</pre>
    </div>
  );
}

export default App;
