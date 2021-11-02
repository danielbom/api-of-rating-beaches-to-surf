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

  it("should exclude incomplete data points", async () => {
    const lat = -33.12312;
    const lng = 151.12312;
    const incompleteResponse = {
      hours: [
        {
          windDirection: { noaa: 300 },
          time: "2020-10-30",
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    const lat = -33.12312;
    const lng = 151.12312;

    mockedAxios.get.mockRejectedValue({ message: "Network Error" });

    const stormGlass = new StormGlass(mockedAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service responds with error", async () => {
    const lat = -33.12312;
    const lng = 151.12312;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });

    const stormGlass = new StormGlass(mockedAxios);
    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
