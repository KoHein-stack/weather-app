export type Unit = 'metric' | 'imperial';

export type SelectedLocation = {
  lat: number;
  lon: number;
  name: string;
  country?: string;
};

export type CurrentWeatherResponse = {
  dt: number;
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{ main: string; description: string }>;
  wind: {
    speed: number;
  };
  visibility?: number;
};

export type ForecastItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity?: number;
    pressure?: number;
  };
  weather: Array<{ main: string; description: string }>;
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
