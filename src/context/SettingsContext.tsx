import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SelectedLocation, Unit } from '../types';

type SettingsContextValue = {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  selectedLocation: SelectedLocation | null;
  setSelectedLocation: (location: SelectedLocation | null) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const SETTINGS_KEY = 'weather_app_settings';

export function SettingsProvider({ children }: { children: ReactNode }): JSX.Element {
  const [unit, setUnit] = useState<Unit>('metric');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  useEffect(() => {
    (async () => {
      const rawSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (rawSettings) {
        const parsed = JSON.parse(rawSettings) as { unit?: Unit };
        setUnit(parsed.unit ?? 'metric');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ unit }));
  }, [unit]);

  const value = useMemo(
    () => ({
      unit,
      setUnit,
      selectedLocation,
      setSelectedLocation
    }),
    [selectedLocation, unit]
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
