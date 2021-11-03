import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10,
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static async generateToken(payload: object): Promise<string> {
    return jwt.sign(payload, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.tokenExpiresIn'),
    });
  }
}
