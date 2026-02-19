import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
  const { unit, setUnit } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>
      <Text style={styles.subtitle}>Temperature Unit</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.pill, unit === 'metric' && styles.pillActive]}
          onPress={() => setUnit('metric')}
        >
          <Text style={[styles.pillText, unit === 'metric' && styles.pillTextActive]}>Celsius (°C)</Text>
        </Pressable>
        <Pressable
          style={[styles.pill, unit === 'imperial' && styles.pillActive]}
          onPress={() => setUnit('imperial')}
        >
          <Text style={[styles.pillText, unit === 'imperial' && styles.pillTextActive]}>Fahrenheit (°F)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: theme.spacing.md
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: theme.spacing.lg
  },
  subtitle: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.sm
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm
  },
  pill: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flex: 1,
    padding: theme.spacing.sm
  },
  pillActive: {
    backgroundColor: theme.colors.primary
  },
  pillText: {
    color: theme.colors.text,
    textAlign: 'center'
  },
  pillTextActive: {
    color: '#020617',
    fontWeight: '700'
  }
});
