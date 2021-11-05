declare namespace Express {
  interface Request {
    context: {
      id: string;
    };
  }
}
