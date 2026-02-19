import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import ForecastSection from '../components/home/ForecastSection';
import MainWeatherCard from '../components/home/MainWeatherCard';
import WeatherDetailsGrid from '../components/home/WeatherDetailsGrid';
import WeatherHeader from '../components/home/WeatherHeader';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import useWeather from '../hooks/useWeather';
import { getForecastByCoords, getCurrentWeatherByCoords, searchCity } from '../services/weatherApi';
import { getSearchHistory, saveSearchHistory } from '../store/searchHistory';
import type { GeoCity, SelectedLocation } from '../types';

export default function HomeScreen() {
  const { unit, selectedLocation, setSelectedLocation } = useSettings();
  const [history, setHistory] = useState<SelectedLocation[]>([]);

  // ── Current weather ──────────────────────────────────────────────────────
  const { data: weatherData, loading: weatherLoading, error: weatherError, execute: weatherExecute, setData: setWeatherData } =
    useWeather(getCurrentWeatherByCoords);

  const loadWeather = useCallback(async (): Promise<void> => {
    try {
      if (selectedLocation) {
        await weatherExecute(selectedLocation.lat, selectedLocation.lon, unit);
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission is required to load local weather.');
      }
      const position = await Location.getCurrentPositionAsync({});
      const locationPayload = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        name: 'Your location'
      };
      setSelectedLocation(locationPayload);
      await weatherExecute(locationPayload.lat, locationPayload.lon, unit);
    } catch (err) {
      setWeatherData(null);
      throw err;
    }
  }, [weatherExecute, selectedLocation, setWeatherData, setSelectedLocation, unit]);

  useEffect(() => {
    loadWeather().catch(() => undefined);
  }, [loadWeather]);

  // ── Search ────────────────────────────────────────────────────────────────
  const { execute: searchExecute } = useWeather(searchCity);

  useEffect(() => {
    void getSearchHistory().then(setHistory);
  }, []);

  const onSearch = async (query: string): Promise<void> => {
    if (!query.trim()) return;
    const result = await searchExecute(query, 1);
    if (result && result.length > 0) {
      onSelectLocation(result[0]);
    }
  };

  const onSelectLocation = async (item: GeoCity | SelectedLocation): Promise<void> => {
    const location: SelectedLocation = {
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      country: item.country
    };
    setSelectedLocation(location);
    const updated = await saveSearchHistory(location);
    setHistory(updated);
  };

  // ── Forecast ──────────────────────────────────────────────────────────────
  const { data: forecastData, loading: forecastLoading, error: forecastError, execute: forecastExecute } =
    useWeather(getForecastByCoords);

  const loadForecast = useCallback(async (): Promise<void> => {
    if (!selectedLocation) return;
    await forecastExecute(selectedLocation.lat, selectedLocation.lon, unit);
  }, [forecastExecute, selectedLocation, unit]);

  useEffect(() => {
    void loadForecast();
  }, [loadForecast]);

  const dailySnapshots = useMemo(() => {
    if (!forecastData?.list) return [];
    return forecastData.list.filter((e: any) => e.dt_txt.includes('12:00:00')).slice(0, 7);
  }, [forecastData]);

  // ── Render ────────────────────────────────────────────────────────────────
  const locationDisplayName = selectedLocation
    ? (selectedLocation.name === 'Your location' && weatherData?.name
      ? `${weatherData.name} (Your location)`
      : selectedLocation.name)
    : 'Select Location';

  return (
    <SafeAreaView style={styles.outerContainer}>
      <WeatherHeader
        cityName={locationDisplayName}
        onSearch={(q) => void onSearch(q)}
        onSelectCity={(city) => void onSelectLocation(city)}
        onLocationPress={() => void loadWeather()}
      />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {weatherLoading && <LoadingState message="Fetching weather..." />}
        {weatherError && !weatherLoading && (
          <ErrorState error={weatherError} onRetry={() => void loadWeather()} />
        )}

        {weatherData && !weatherLoading && (
          <>
            <MainWeatherCard
              temp={weatherData.main.temp}
              description={weatherData.weather[0]?.description ?? 'N/A'}
              unit={unit}
            />

            <WeatherDetailsGrid
              humidity={weatherData.main.humidity}
              windSpeed={weatherData.wind.speed}
              pressure={weatherData.main.pressure}
              visibility={weatherData.visibility}
              unit={unit}
            />
          </>
        )}

        {forecastLoading && <LoadingState message="Loading forecast..." />}
        {forecastError && !forecastLoading && (
          <ErrorState error={forecastError} onRetry={() => void loadForecast()} />
        )}

        {dailySnapshots.length > 0 && (
          <ForecastSection data={dailySnapshots} unit={unit} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  }
});
