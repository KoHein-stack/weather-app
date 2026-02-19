import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { Unit } from '../types';

type WeatherCardProps = {
  cityName: string;
  temp: number;
  description: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  unit: Unit;
};

export default function WeatherCard({ 
  cityName, 
  temp, 
  description, 
  feelsLike, 
  humidity, 
  windSpeed, 
  unit 
}: WeatherCardProps) {
  const unitSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <View style={styles.card}>
      <Text style={styles.city}>{cityName}</Text>
      <Text style={styles.temp}>{Math.round(temp)}{unitSymbol}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.row}>
        <Text style={styles.meta}>Feels like: {Math.round(feelsLike)}{unitSymbol}</Text>
        <Text style={styles.meta}>Humidity: {humidity}%</Text>
      </View>
      <Text style={styles.meta}>Wind: {windSpeed} {speedUnit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg
  },
  city: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700'
  },
  temp: {
    color: theme.colors.primary,
    fontSize: 48,
    fontWeight: '700',
    marginTop: theme.spacing.sm
  },
  description: {
    color: theme.colors.text,
    fontSize: 18,
    marginBottom: theme.spacing.md,
    textTransform: 'capitalize'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  meta: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.xs
  }
});
