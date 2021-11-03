import AuthService from '@src/services/AuthService';
import { Request, Response } from 'express';
import authMiddleware from '../authMiddleware';

describe('AuthMiddleware', () => {
  it('should verify a JWT token and call the next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake' });
    const reqFake = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    } as unknown as Request;
    const resFake = {} as unknown as Response;
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toBeCalledTimes(1);
  });

  it('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const reqFake = {
      headers: {
        authorization: 'Bearer invalid token',
      },
    } as unknown as Request;
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    } as unknown as Response;
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(nextFake).not.toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });

  it('should return ANAUTHORIZED middleware if theres no token', () => {
    const reqFake = {
      headers: {},
    } as unknown as Request;
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    } as unknown as Response;
    const nextFake = jest.fn();
    authMiddleware(reqFake, resFake, nextFake);
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(nextFake).not.toHaveBeenCalled();
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    });
  });
});
