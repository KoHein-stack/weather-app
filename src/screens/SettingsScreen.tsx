import React from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { StackNavigationProp } from '@react-navigation/stack';

type SettingsStackParamList = {
  SettingsHome: undefined;
  UserAgreement: undefined;
  PrivacyPolicy: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

type Props = {
  navigation: SettingsScreenNavigationProp;
};

export default function SettingsScreen({ navigation }: Props) {
  const { unit, setUnit } = useSettings();

  const appVersion = "1.0.0";

  return (
    <ScrollView style={styles.container}>
      {/* Temperature Unit Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
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

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('UserAgreement')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="document-text-outline" size={20} color={theme.colors.muted} />
            <Text style={styles.menuItemText}>User Agreement</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </Pressable>

        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.muted} />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </Pressable>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.muted} />
            <Text style={styles.menuItemText}>Version Number</Text>
          </View>
          <Text style={styles.versionText}>{appVersion}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  section: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pill: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flex: 1,
    padding: theme.spacing.sm,
  },
  pillActive: {
    backgroundColor: theme.colors.primary,
  },
  pillText: {
    color: theme.colors.text,
    textAlign: 'center',
  },
  pillTextActive: {
    color: '#020617',
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  menuItemText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    color: theme.colors.muted,
    fontSize: 14,
  }
});
