import { SuperTest, Test } from "supertest";

global {
  // eslint-disable-next-line
  declare var testRequest: SuperTest<Test>;
}
