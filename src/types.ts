export type Unit = 'metric' | 'imperial';

export type SelectedLocation = {
  lat: number;
  lon: number;
  name: string;
  country?: string;
};

export type CurrentWeatherResponse = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{ description: string }>;
  wind: {
    speed: number;
  };
};

export type ForecastItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: Array<{ description: string }>;
};

export type ForecastResponse = {
  list: ForecastItem[];
};

export type GeoCity = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};
