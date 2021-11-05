import UserRepository from '@src/models/UserRepository';
import AuthService from '@src/services/AuthService';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await UserRepository.deleteMany({});
  });

  describe('When creating a new user', () => {
    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePasswords(response.body.password, newUser.password),
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          password: expect.any(String),
        }),
      );
    });

    it('Should return 400 when there is a validation error', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('Should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'Conflict',
        message: 'User validation failed: email: already exists in the database.',
      });
    });
  });

  describe('When authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await new UserRepository(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) }),
      );
    });
    it('Should return UNAUTHORIZED if the user with the given email is not found', async () => {
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'some-email@mail.com', password: '1234' });

      expect(response.status).toBe(401);
    });

    it('Should return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await new UserRepository(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: 'different password' });

      expect(response.status).toBe(401);
    });
  });

  describe('When getting user profile info', () => {
    it('Should return the token\'s owner profile information', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      const user = await new UserRepository(newUser).save();
      const token = AuthService.generateToken({ sub: user.id.toString() });
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ Authorization: `Bearer ${token}` });

      expect(status).toBe(200);
      expect(body).toMatchObject(user.toJSON());
    });

    it('Should return Not Found, when the user is not found', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      // create a new user but don't save it
      const user = new UserRepository(newUser);
      const token = AuthService.generateToken({ sub: user.id.toString() });
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ Authorization: `Bearer ${token}` });

      expect(status).toBe(404);
      expect(body.message).toBe('User not found!');
    });
  });
});
