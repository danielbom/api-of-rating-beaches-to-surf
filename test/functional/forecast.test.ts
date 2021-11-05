import nock from 'nock';
import stormGlassWeather3Hours from '@test/fixture/stormglass_weather_3_hours.json';
import apiForecastResponse1Beach from '@test/fixture/api_forecast_response_1_beach.json';
import BeachRepository, { GeoPosition } from '@src/models/BeachRepository';
import UserRepository from '@src/models/UserRepository';
import AuthService from '@src/services/AuthService';

describe('Beach forecast functional tests', () => {
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
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
      user: userId,
    };
    await new BeachRepository(defaultBeach).save();
    token = AuthService.generateToken({ id: userId });
  });

  it('should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: () => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params:
          'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed',
        source: 'noaa',
        end: /.?/,
      })
      .reply(200, stormGlassWeather3Hours);

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ Authorization: `Bearer ${token}` });
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1Beach);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v1/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest
      .get('/forecast')
      .set({ Authorization: `Bearer ${token}` });

    expect(status).toBe(500);
  });
});
