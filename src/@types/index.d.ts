declare global {
  import express from 'express';

  declare module 'express' {
    interface TokenDecoded {
      id: string;
    }
    export interface Request extends express.Request {
      decoded?: TokenDecoded;
    }
  }
}
