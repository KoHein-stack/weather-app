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
  // Settings context is the single source of truth for unit/language/current city.
  const { unit, language, selectedLocation, setSelectedLocation } = useSettings();

  // Keep recent searches local to this screen; persistence is handled by searchHistory store.
  const [history, setHistory] = useState<SelectedLocation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // useWeather encapsulates loading/error state so UI can stay declarative.
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
      // Persist selected GPS location into context so forecast + header stay in sync.
      setSelectedLocation(locationPayload);
      await weatherExecute(locationPayload.lat, locationPayload.lon, unit);
    } catch (err) {
      // Clear stale weather if the fresh request fails to avoid showing outdated data.
      setWeatherData(null);
      throw err;
    }
  }, [weatherExecute, selectedLocation, setWeatherData, setSelectedLocation, unit]);

  // Re-load weather whenever the location or unit setting changes
  useEffect(() => {
    loadWeather().catch(() => undefined);
  }, [loadWeather]);

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
      // Product decision: auto-pick first result for faster search flow.
      void onSelectLocation(result[0]);
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

  // Forecast API returns 3-hour buckets for the next 5 days.
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

  // 24 * 3h entries = next 72 hours.
  const next72HoursData = useMemo(() => {
    if (!forecastData?.list) return [];
    return forecastData.list.slice(0, 24);
  }, [forecastData]);

  // Noon snapshots produce stable daily cards and avoid day-boundary duplicates.
  const dailySnapshots = useMemo(() => {
    if (!forecastData?.list) return [];
    return forecastData.list.filter((entry) => entry.dt_txt.includes('12:00:00')).slice(0, 7);
  }, [forecastData]);

  // Support both raw and translated "Your location" labels to keep logic language-safe.
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
          <ErrorState error={weatherError} onRetry={() => void onRefresh()} /> 
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
          <ErrorState error={forecastError} onRetry={() => void onRefresh()} />
        )}

        {next72HoursData.length > 0 && (
          <ForecastSection data={next72HoursData} unit={unit} language={language} />
        )}

        {dailySnapshots.length > 0 && (
          <WeeklyForecastSection data={dailySnapshots} unit={unit} language={language} />
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

