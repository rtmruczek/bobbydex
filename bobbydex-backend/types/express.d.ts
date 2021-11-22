declare namespace Express {
  interface Request {
    user?: {
      accessToken?: string;
    };
  }
}
