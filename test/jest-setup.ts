import supertest from "supertest";
import SetupServer from "@src/SetupServer";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

let server: SetupServer;

beforeAll(async () => {
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());

  await sleep(1000);
});

afterAll(async () => {
  await server.close();
});
