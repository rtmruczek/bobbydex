import { assign, createMachine } from 'xstate';
import qs from 'query-string';

const queryString = new URLSearchParams({
  client_id: process.env.REACT_APP_DISCORD_CLIENT_ID!,
  redirect_uri: process.env.REACT_APP_DISCORD_REDIRECT_URI!,
  scope: 'identify email',
  response_type: 'code',
}).toString();
const authorize = () => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${queryString}`;
  window.location.assign(discordAuthUrl);
};

const fetchToken = async ({ code, refreshToken }: Context) => {
  let body = new URLSearchParams({
    client_id: process.env.REACT_APP_DISCORD_CLIENT_ID!,
    client_secret: process.env.REACT_APP_DISCORD_CLIENT_SECRET!,
    redirect_uri: process.env.REACT_APP_DISCORD_REDIRECT_URI!,
  });
  if (refreshToken) {
    body.append('refresh_token', refreshToken);
    body.append('grant_type', 'refresh_token');
  } else if (code) {
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
  }
  const discordTokenUrl = `https://discord.com/api/oauth2/token`;
  const response = await fetch(discordTokenUrl, {
    method: 'POST',
    body: body.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const json = await response.json();

  if (response.status === 200) {
    return json;
  }
  throw new Error(json);
};

const fetchUser = async ({ accessToken }: Context) => {
  const url = `https://discord.com/api/oauth2/@me`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const json = await response.json();
  return json;
};
interface Context {
  code?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {};
}

const createAuthMachine = (context: Context) =>
  createMachine<Context>({
    id: 'auth',
    initial: 'init',
    context,
    states: {
      init: {
        on: {
          BEGIN_AUTH: [
            {
              target: 'retrieving_token',
              cond: (context) =>
                !context.accessToken &&
                !!(context.code || context.refreshToken),
            },
            {
              target: 'authorizing',
            },
          ],
        },
      },
      authorizing: {
        entry: authorize,
      },
      retrieving_token: {
        invoke: {
          src: fetchToken,
          onDone: {
            target: 'fetching_user',
            actions: [
              assign({
                accessToken: (_context, event) => event.data.access_token,
                refreshToken: (_context, event) => event.data.refresh_token,
              }),
              (context) => {
                localStorage.setItem(
                  process.env.REACT_APP_REFRESH_TOKEN_KEY!,
                  context.refreshToken!
                );
              },
            ],
          },
          onError: {
            actions: [
              (_context, event) => {
                console.error(event);
              },
            ],
          },
        },
      },
      fetching_user: {
        invoke: {
          src: fetchUser,
          onDone: {
            target: 'authed',
            actions: assign({
              user: (context, event) => event.data,
            }),
          },
        },
      },
      authed: {},
      auth_error: {},
    },
  });
const authMachine = createAuthMachine({
  code: qs.parse(window.location.search).code as string,
  refreshToken:
    localStorage.getItem(process.env.REACT_APP_REFRESH_TOKEN_KEY!) ?? undefined,
});

export default authMachine;
