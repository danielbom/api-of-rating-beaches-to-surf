import { NextFunction, Request, Response } from 'express';
import AuthService from '@src/services/AuthService';

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const token = request.headers.authorization;
  try {
    if (!token) throw new Error('jwt must be provided');
    const decoded = AuthService.decodeToken(token.replace(/^Bearer /, ''));
    request.decoded = decoded;
    next();
  } catch (err: any) {
    response.status(401).send({ code: 401, error: err.message });
  }
}
