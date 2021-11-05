import BeachRepository, { GeoPosition } from '@src/models/BeachRepository';
import UserRepository from '@src/models/UserRepository';
import AuthService from '@src/services/AuthService';

describe('Beaches functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john2@mail.com',
    password: '1234',
  };
  let token: string;

  beforeEach(async () => {
    await BeachRepository.deleteMany();
    await UserRepository.deleteMany();
    const user = await new UserRepository(defaultUser).save();
    const userId = user.id.toString();
    token = AuthService.generateToken({ sub: userId });
  });

  describe('When creating a beach', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
      };

      const response = await global.testRequest
        .post('/beaches')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBeach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should throw 400 when is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
      };
      const response = await global.testRequest
        .post('/beaches')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBeach);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'request.body.lat should be number',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(BeachRepository.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject(new Error('fail to create beach')));

      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: GeoPosition.E,
      };
      const response = await global.testRequest
        .post('/beaches')
        .set({ Authorization: `Bearer ${token}` })
        .send(newBeach);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      });
    });
  });
});
