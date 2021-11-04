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
    token = AuthService.generateToken({ id: userId });
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

    it('should throw 422 when is a validation error', async () => {
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

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'Unprocessable Entity',
        message: 'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      });
    });

    it.skip('should return 500 when there is any error other than validation error', async () => {
      // TODO: think in a way to throw a 500
    });
  });
});
