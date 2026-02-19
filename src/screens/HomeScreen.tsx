import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
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
  // ── Global Context ────────────────────────────────────────────────────────
  // unit: 'metric' (C) or 'imperial' (F)
  // selectedLocation: object containing lat, lon, and name of the current city
  const { unit, selectedLocation, setSelectedLocation } = useSettings();

  // ── Local State ───────────────────────────────────────────────────────────
  // history: Array of previously searched cities retrieved from AsyncStorage
  const [history, setHistory] = useState<SelectedLocation[]>([]);
  // refreshing: Controls the visibility of the pull-to-refresh spinner
  const [refreshing, setRefreshing] = useState(false);

  // ── Current Weather Data ──────────────────────────────────────────────────
  // useWeather hook abstracts the API calling, loading states, and error handling
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    execute: weatherExecute,
    setData: setWeatherData
  } = useWeather(getCurrentWeatherByCoords);

  /**
   * Fetches weather for either the user's selected city OR their current GPS location.
   */
  const loadWeather = useCallback(async (): Promise<void> => {
    try {
      if (selectedLocation) {
        // Fetch weather for the city selected by the user
        await weatherExecute(selectedLocation.lat, selectedLocation.lon, unit);
        return;
      }

      // If no city is selected, request device coordinates
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

  // Re-load weather whenever the location or unit setting changes
  useEffect(() => {
    loadWeather().catch(() => undefined);
  }, [loadWeather]);

  // ── Search & History Implementation ───────────────────────────────────────
  const { execute: searchExecute } = useWeather(searchCity);

  // Initial load of search history from persistent storage
  useEffect(() => {
    void getSearchHistory().then(setHistory);
  }, []);

  /**
   * Handles manual search submission (Enter/Search key on keyboard).
   * Automatically selects the first matching city returned by the API.
   */
  const onSearch = async (query: string): Promise<void> => {
    if (!query.trim()) return;
    const result = await searchExecute(query, 1);
    if (result && result.length > 0) {
      onSelectLocation(result[0]);
    }
  };

  /**
   * Updates global app state to the new city and saves it to the persistent recent searches list.
   */
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

  // ── Forecast Data Hook ────────────────────────────────────────────────────
  // Fetches 5-day / 3-hour forecast data from OpenWeatherMap
  const {
    data: forecastData,
    loading: forecastLoading,
    error: forecastError,
    execute: forecastExecute
  } = useWeather(getForecastByCoords);

  /**
   * Fetches the forecast data for the currently selected location.
   */
  const loadForecast = useCallback(async (): Promise<void> => {
    if (!selectedLocation) return;
    await forecastExecute(selectedLocation.lat, selectedLocation.lon, unit);
  }, [forecastExecute, selectedLocation, unit]);

  useEffect(() => {
    void loadForecast();
  }, [loadForecast]);

  /**
   * Triggers a full refresh of both weather and forecast data (Pull-to-Refresh).
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadWeather(), loadForecast()]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadWeather, loadForecast]);

  // Process raw forecast list to show midday snapshots for each of the next 7 days
  const dailySnapshots = useMemo(() => {
    if (!forecastData?.list) return [];
    return forecastData.list.filter((e: any) => e.dt_txt.includes('12:00:00')).slice(0, 7);
  }, [forecastData]);

  // ── Render ────────────────────────────────────────────────────────────────
  // Display 'Your location' if the city name matches the device's current location
  const locationDisplayName = selectedLocation
    ? (selectedLocation.name === 'Your location' && weatherData?.name
      ? `${weatherData.name} (Your location)`
      : selectedLocation.name)
    : 'Select Location';

  return (
    <SafeAreaView style={styles.outerContainer}>
      <WeatherHeader
        cityName={locationDisplayName}
        history={history}
        onSearch={(q) => void onSearch(q)}
        onSelectCity={(city) => void onSelectLocation(city)}
        onLocationPress={() => void loadWeather()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {weatherLoading && !refreshing && <LoadingState message="Fetching weather..." />}
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
              feelsLike={weatherData.main.feels_like}
              unit={unit}
            />
          </>
        )}

        {forecastLoading && !refreshing && <LoadingState message="Loading forecast..." />}
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
