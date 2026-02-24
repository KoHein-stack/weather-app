import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Language, SelectedLocation, Unit } from '../types';

type SettingsContextValue = {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  selectedLocation: SelectedLocation | null;
  setSelectedLocation: (location: SelectedLocation | null) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const SETTINGS_KEY = 'weather_app_settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>('metric');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  useEffect(() => {
    (async () => {
      const rawSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings) as { unit?: Unit; language?: Language };
        setUnit(parsed.unit ?? 'metric');
        setLanguage(parsed.language ?? 'en');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ unit, language }));
  }, [language, unit]);

  const value = useMemo(
    () => ({
      unit,
      setUnit,
      language,
      setLanguage,
      selectedLocation,
      setSelectedLocation
    }),
    [language, selectedLocation, unit]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return context;
}
