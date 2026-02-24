import * as Location from 'expo-location';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import ForecastSection from '../components/home/ForecastSection';
import MainWeatherCard from '../components/home/MainWeatherCard';
import WeatherDetailsGrid from '../components/home/WeatherDetailsGrid';
import WeatherHeader from '../components/home/WeatherHeader';
import WeeklyForecastSection from '../components/home/WeeklyForecastSection';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import useWeather from '../hooks/useWeather';
import { t } from '../i18n/strings';
import { getForecastByCoords, getCurrentWeatherByCoords, searchCity } from '../services/weatherApi';
import { clearSearchHistory, getSearchHistory, saveSearchHistory } from '../store/searchHistory';
import type { GeoCity, SelectedLocation } from '../types';

export default function HomeScreen() {
  // ── Global Context ────────────────────────────────────────────────────────
  // unit: 'metric' (C) or 'imperial' (F)
  // selectedLocation: object containing lat, lon, and name of the current city
  const { unit, language, selectedLocation, setSelectedLocation } = useSettings();

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
        name: t(language, 'home.yourLocation')
      };
      // current location 
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

  const onClearHistory = async (): Promise<void> => {
    await clearSearchHistory();
    setHistory([]);
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

  // Next 72 hours in 3-hour steps from OpenWeather 5-day forecast
  const next72HoursData = useMemo(() => {
    if (!forecastData?.list) return [];
    return forecastData.list.slice(0, 24);
  }, [forecastData]);

  const dailySnapshots = useMemo(() => {
    if (!forecastData?.list) return [];
    return forecastData.list.filter((entry) => entry.dt_txt.includes('12:00:00')).slice(0, 7);
  }, [forecastData]);

  // ── Render ────────────────────────────────────────────────────────────────
  // Display 'Your location' if the city name matches the device's current location
  const isCurrentLocationLabel = selectedLocation?.name === 'Your location'
    || selectedLocation?.name === t(language, 'home.yourLocation');

  const locationDisplayName = selectedLocation
    ? (isCurrentLocationLabel && weatherData?.name
      ? `${weatherData.name} (${t(language, 'home.yourLocation')})`
      : selectedLocation.name)
    : t(language, 'home.searchLocation');

  const weatherUpdatedLabel = useMemo(() => {

    if (!weatherData?.dt) return '';
    const updatedAt = new Date(weatherData.dt * 1000);
    // alert(`${updatedAt.toLocaleDateString()}  ${updatedAt.toLocaleTimeString([] ,{
    //   hour: '2-digit',
    //   minute: '2-digit'
    // })}`)
    return `${t(language, 'home.updated')} ${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }, [language, weatherData]);

  return (
    <SafeAreaView style={styles.outerContainer}>
      <WeatherHeader
        cityName={locationDisplayName}
        history={history}
        onSearch={(q) => void onSearch(q)}
        onSelectCity={(city) => void onSelectLocation(city)}
        onLocationPress={() => void loadWeather()}
        onClearHistory={() => void onClearHistory()}
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
        {weatherLoading && !refreshing && <LoadingState message={t(language, 'home.fetchingWeather')} />}
        {weatherError && !weatherLoading && (
          <ErrorState error={weatherError} onRetry={() => void loadWeather()} />
        )}

        {weatherData && !weatherLoading && (
          <>
            <Text style={styles.updatedText}>{weatherUpdatedLabel}</Text>
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

        {forecastLoading && !refreshing && <LoadingState message={t(language, 'home.loadingForecast')} />}
        {forecastError && !forecastLoading && (
          <ErrorState error={forecastError} onRetry={() => void loadForecast()} />
        )}

        {next72HoursData.length > 0 && (
          <ForecastSection data={next72HoursData} unit={unit} />
        )}

        {dailySnapshots.length > 0 && (
          <WeeklyForecastSection data={dailySnapshots} unit={unit} />
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
  },
  updatedText: {
    color: theme.colors.muted,
    fontSize: 13,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
});

