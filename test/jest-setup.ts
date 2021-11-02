import supertest from "supertest";
import SetupServer from "@src/SetupServer";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

beforeAll(async () => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());

  await sleep(1000);
});
