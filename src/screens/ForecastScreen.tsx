import { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import useWeather from '../hooks/useWeather';
import { getForecastByCoords } from '../services/weatherApi';
import { formatDayLabel } from '../utils/date';

export default function ForecastScreen(): JSX.Element {
  const { selectedLocation, unit } = useSettings();
  const { data, loading, error, execute } = useWeather(getForecastByCoords);

  const loadForecast = useCallback(async (): Promise<void> => {
    if (!selectedLocation) {
      return;
    }
    await execute(selectedLocation.lat, selectedLocation.lon, unit);
  }, [execute, selectedLocation, unit]);

  useEffect(() => {
    void loadForecast();
  }, [loadForecast]);

  const dailySnapshots = useMemo(() => {
    if (!data?.list) return [];
    const selected = data.list.filter((entry) => entry.dt_txt.includes('12:00:00'));
    return selected.slice(0, 7);
  }, [data]);

  if (!selectedLocation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.muted}>Choose a city in Search screen first.</Text>
      </View>
    );
  }

  if (loading) return <LoadingState message="Loading 7-day outlook..." />;
  if (error) return <ErrorState error={error} onRetry={() => void loadForecast()} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>7-Day Forecast for {selectedLocation.name}</Text>
      {dailySnapshots.map((item) => (
        <View key={item.dt} style={styles.item}>
          <Text style={styles.day}>{formatDayLabel(item.dt)}</Text>
          <Text style={styles.temp}>{Math.round(item.main.temp)}{unit === 'metric' ? '°C' : '°F'}</Text>
          <Text style={styles.desc}>{item.weather[0]?.description ?? ''}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flexGrow: 1,
    padding: theme.spacing.md
  },
  centered: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  muted: {
    color: theme.colors.muted
  },
  header: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.md
  },
  item: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md
  },
  day: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600'
  },
  temp: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '700'
  },
  desc: {
    color: theme.colors.muted,
    textTransform: 'capitalize'
  }
});
