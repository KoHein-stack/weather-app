import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type DetailItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <View style={styles.item}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color={theme.colors.primary} />
    </View>
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

type WeatherDetailsGridProps = {
  humidity: number;
  windSpeed: number;
  pressure: number;
  feelsLike: number;
  unit: string;
};

export default function WeatherDetailsGrid({ 
  humidity, 
  windSpeed, 
  pressure, 
  feelsLike, 
  unit 
}: WeatherDetailsGridProps) {
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';
  const tempSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';

  return (
    <View style={styles.grid}>
      <DetailItem 
        icon="water-outline" 
        label="Humidity" 
        value={`${humidity}%`} 
      />
      <DetailItem 
        icon="speedometer-outline" 
        label="Wind" 
        value={`${windSpeed} ${speedUnit}`} 
      />
      <DetailItem 
        icon="thermometer-outline" 
        label="Feels Like" 
        value={`${Math.round(feelsLike)}${tempSymbol}`} 
      />
      <DetailItem 
        icon="compass-outline" 
        label="Pressure" 
        value={`${pressure} hPa`} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  item: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    width: '47%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
});
