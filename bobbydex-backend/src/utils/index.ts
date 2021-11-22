import * as express from 'express';

export type AsyncRequestHandler<T> = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<T>;

export function wrapAsync<T>(
  handler: AsyncRequestHandler<T | void>
): express.RequestHandler {
  return (req, res, next) => {
    return handler(req, res, next).catch(next);
  };
}
