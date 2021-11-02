import supertest from 'supertest';
import SetupServer from '@src/SetupServer';

beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
});
