import StormGlass from "../StormGlass";
import axios from "axios";
import stormGlassWeather3Hours from "@test/fixture/stormglass_weather_3_hours.json";
import stormGlassWeather3HoursNormalized from "@test/fixture/stormglass_normalized_response_3_hours.json";

jest.mock("axios");

describe("StormGlass client", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.12312;
    const lng = 151.12312;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3Hours });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassWeather3HoursNormalized);
  });
});
