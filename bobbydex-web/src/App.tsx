import React from 'react';
import './App.css';
import { useMachine } from '@xstate/react';
import authMachine from './machines/auth.machine';

function App() {
  const [_state, send] = useMachine(authMachine, { devTools: true });
  console.log(_state);
  send({ type: 'TRY_AUTH' });
  return <div>{process.env.NODE_ENV}</div>;
}

export default App;
