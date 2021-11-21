import { assign, createMachine } from 'xstate';
import qs from 'query-string';
import { interpret } from 'xstate';
import { inspect } from '@xstate/inspect';

const queryString = new URLSearchParams({
  client_id: process.env.REACT_APP_DISCORD_CLIENT_ID!,
  redirect_uri: process.env.REACT_APP_DISCORD_REDIRECT_URI!,
  scope: 'identify email',
  response_type: 'code',
}).toString();

export const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${queryString}`;
const authMachine = createMachine({
  id: 'auth',
  initial: 'init',
  context: {
    code: qs.parse(window.location.search).code,
  },
  states: {
    init: {
      on: {
        TRY_AUTH: [
          {
            target: 'authorizing',
            cond: (context) => !context.code,
          },
          {
            target: 'retrieving_token',
          },
        ],
      },
    },
    authorizing: {},
    retrieving_token: {},
    authed: {},
  },
});

const authorize = () => {
  window.location.assign(discordAuthUrl);
};

export default authMachine;
