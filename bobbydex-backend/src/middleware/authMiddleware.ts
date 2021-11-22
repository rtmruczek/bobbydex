import fetch from 'cross-fetch';
import { wrapAsync } from '../utils';

export const authMiddleware = wrapAsync(async (req, res, next) => {
  const authorization = req.headers['authorization'] as string;

  const response = await fetch('https://discord.com/api/oauth2/@me', {
    headers: {
      authorization,
    },
  });

  if (response.status !== 200) {
    return res.sendStatus(response.status);
  }

  req.user = {
    accessToken: authorization.split('Bearer ')[0],
  };
  return next();
});
