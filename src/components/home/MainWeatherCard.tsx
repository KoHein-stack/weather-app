import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { getWeatherIcon } from '../../utils/weatherIcons';

type MainWeatherCardProps = {
  temp: number;
  description: string;
  unit: string;
};

export default function MainWeatherCard({ temp, description, unit }: MainWeatherCardProps) {
  const unitSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons 
          name={getWeatherIcon(description)} 
          size={100} 
          color={theme.colors.primary} 
          style={styles.icon} 
        />
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>{Math.round(temp)}</Text>
          <Text style={styles.unit}>{unitSymbol}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 24,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temp: {
    fontSize: 80,
    fontWeight: '700',
    color: theme.colors.text,
  },
  unit: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 12,
    marginLeft: 4,
  },
  description: {
    fontSize: 20,
    color: theme.colors.muted,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
});
