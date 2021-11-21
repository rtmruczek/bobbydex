import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useMachine } from '@xstate/react';
import authMachine from './machines/auth.machine';

function App() {
  const [state, send] = useMachine(authMachine, { devTools: true });
  send({ type: 'TRY_AUTH' });
  return <div>{process.env.NODE_ENV}</div>;
}

export default App;
