import BeachRepository, { BeachPosition } from "@src/models/BeachRepository";
import stormGlassWeather3Hours from "@test/fixture/stormglass_weather_3_hours.json";
import apiForecastResponse1Beach from "@test/fixture/api_forecast_response_1_beach.json";
import nock from "nock";

describe("Beach forecast functional tests", () => {
  beforeEach(async () => {
    await BeachRepository.deleteMany({});
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: "Manly",
      position: BeachPosition.E,
    };
    const beach = new BeachRepository(defaultBeach);
    await beach.save();
  });
  it("should return a forecast with just a few times", async () => {
    nock("https://api.stormglass.io:443", {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: () => true,
      },
    })
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/v2/weather/point")
      .query({
        lat: "-33.792726",
        lng: "151.289824",
        params:
          "swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed",
        source: "noaa",
      })
      .reply(200, stormGlassWeather3Hours);

    const { body, status } = await global.testRequest.get("/forecast");
    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1Beach);
  });

  it("should return 500 if something goes wrong during the processing", async () => {
    nock("https://api.stormglass.io:443", {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/v1/weather/point")
      .query({ lat: "-33.792726", lng: "151.289824" })
      .replyWithError("Something went wrong");

    const { status } = await global.testRequest.get(`/forecast`);

    expect(status).toBe(500);
  });
});
