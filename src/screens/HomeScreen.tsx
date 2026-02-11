import * as Location from 'expo-location';
import { useCallback, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import WeatherCard from '../components/WeatherCard';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import useWeather from '../hooks/useWeather';
import { getCurrentWeatherByCoords } from '../services/weatherApi';

export default function HomeScreen(): JSX.Element | null {
  const { unit, selectedLocation, setSelectedLocation } = useSettings();
  const { data, loading, error, execute, setData } = useWeather(getCurrentWeatherByCoords);

  const loadWeather = useCallback(async (): Promise<void> => {
    try {
      if (selectedLocation) {
        await execute(selectedLocation.lat, selectedLocation.lon, unit);
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
      await execute(locationPayload.lat, locationPayload.lon, unit);
    } catch (err) {
      setData(null);
      throw err;
    }
  }, [execute, selectedLocation, setData, setSelectedLocation, unit]);

  useEffect(() => {
    loadWeather().catch(() => undefined);
  }, [loadWeather]);

  if (loading) return <LoadingState message="Fetching your local weather..." />;
  if (error) return <ErrorState error={error} onRetry={() => void loadWeather()} />;
  if (!data) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WeatherCard
        cityName={data.name}
        temp={data.main.temp}
        description={data.weather[0]?.description ?? 'N/A'}
        feelsLike={data.main.feels_like}
        humidity={data.main.humidity}
        windSpeed={data.wind.speed}
        unit={unit}
      />
      <View style={styles.section}>
        <Text style={styles.heading}>Quick insight</Text>
        <Text style={styles.copy}>
          {data.main.temp > 30
            ? 'It is hot today. Keep hydrated and avoid direct sunlight at noon.'
            : 'Comfortable weather today. Good day for outdoor plans.'}
        </Text>
      </View>
      <Pressable style={styles.reloadButton} onPress={() => void loadWeather()}>
        <Text style={styles.reloadText}>Refresh</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flexGrow: 1,
    padding: theme.spacing.md
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md
  },
  heading: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.xs
  },
  copy: {
    color: theme.colors.muted,
    lineHeight: 20
  },
  reloadButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md
  },
  reloadText: {
    color: '#020617',
    fontWeight: '700'
  }
});
