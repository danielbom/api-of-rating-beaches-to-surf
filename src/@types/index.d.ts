declare global {
  import express from 'express';

  declare module 'express' {
    export interface Request extends express.Request {
      decoded?: undefined | {
        id: string;
      };
    }
  }
}
