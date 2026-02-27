import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n/strings';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';

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
  const { unit, setUnit, language, setLanguage } = useSettings();

  // Local constant for manual bump; replace with app config/version service when introduced.
  const appVersion = '1.0.0';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          {t(language, 'settings.preferences')}
        </Text>

        <Text allowFontScaling={false} style={styles.subtitle}>
          {t(language, 'settings.temperatureUnit')}
        </Text>
        <View style={styles.row}>
          {/* Unit toggles update global settings context; weather data will re-fetch in HomeScreen. */}
          <Pressable
            style={[styles.pill, unit === 'metric' && styles.pillActive]}
            onPress={() => setUnit('metric')}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.pillText, unit === 'metric' && styles.pillTextActive]}
            >
              {t(language, 'settings.celsius')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.pill, unit === 'imperial' && styles.pillActive]}
            onPress={() => setUnit('imperial')}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.pillText, unit === 'imperial' && styles.pillTextActive]}
            >
              {t(language, 'settings.fahrenheit')}
            </Text>
          </Pressable>
        </View>

        <Text allowFontScaling={false} style={[styles.subtitle, styles.languageSubtitle]}>
          {t(language, 'settings.language')}
        </Text>
        <View style={styles.row}>
          {/* Language switch is immediate because all labels are resolved via t(language, ...). */}
          <Pressable
            style={[styles.pill, language === 'en' && styles.pillActive]}
            onPress={() => setLanguage('en')}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.pillText, language === 'en' && styles.pillTextActive]}
            >
              {t(language, 'settings.english')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.pill, language === 'mm' && styles.pillActive]}
            onPress={() => setLanguage('mm')}
          >
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.pillText, language === 'mm' && styles.pillTextActive]}
            >
              {t(language, 'settings.myanmar')}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          {t(language, 'settings.about')}
        </Text>

        <Pressable style={styles.menuItem} onPress={() => navigation.navigate('UserAgreement')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="document-text-outline" size={20} color={theme.colors.muted} />
            <Text allowFontScaling={false} numberOfLines={1} style={styles.menuItemText}>
              {t(language, 'settings.userAgreement')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.muted} />
            <Text allowFontScaling={false} numberOfLines={1} style={styles.menuItemText}>
              {t(language, 'settings.privacyPolicy')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.muted} />
        </Pressable>

        <View style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.muted} />
            <Text allowFontScaling={false} numberOfLines={1} style={styles.menuItemText}>
              {t(language, 'settings.versionNumber')}
            </Text>
          </View>
          <Text allowFontScaling={false} style={styles.versionText}>
            {appVersion}
          </Text>
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
    lineHeight: 28,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  languageSubtitle: {
    marginTop: theme.spacing.md,
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
    fontSize: 14,
    lineHeight: 20,
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
    lineHeight: 22,
    fontWeight: '500',
    flexShrink: 1,
  },
  versionText: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
