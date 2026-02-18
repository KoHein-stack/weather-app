import type { CurrentWeatherResponse, ForecastResponse, GeoCity, Unit } from '../types';

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
// const BASE_URL = 'http://api.weatherapi.com/v1'
// const GEO_URL = 'http://api.weatherapi.com/v1';

function ensureApiKey(): void {
  if (!API_KEY) {
    throw new Error('Missing API key. Add EXPO_PUBLIC_WEATHER_API_KEY to your .env file.');
  }
}

async function request<T>(url: string): Promise<T> {
  ensureApiKey();
  const response = await fetch(url);

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => ({}))) as { message?: string };
    const message = errorPayload.message || 'Unable to fetch weather data.';
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getCurrentWeatherByCoords(lat: number, lon: number, unit: Unit = 'metric'): Promise<CurrentWeatherResponse> {
  return request<CurrentWeatherResponse>(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`);
}

export async function getForecastByCoords(lat: number, lon: number, unit: Unit = 'metric'): Promise<ForecastResponse> {
  return request<ForecastResponse>(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`);
}

export async function searchCity(query: string, limit = 5): Promise<GeoCity[]> {
  if (!query?.trim()) {
    return [];
  }
  return request<GeoCity[]>(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`);
}
