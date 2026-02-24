import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SelectedLocation } from '../types';

const SEARCH_HISTORY_KEY = 'weather_search_history';

export async function getSearchHistory(): Promise<SelectedLocation[]> {
  const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
  return stored ? (JSON.parse(stored) as SelectedLocation[]) : [];
}

export async function saveSearchHistory(city: SelectedLocation): Promise<SelectedLocation[]> {
  const current = await getSearchHistory();
  const deduped = [city, ...current.filter((item) => item.name !== city.name)].slice(0, 6);
  await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(deduped));
  return deduped;
}

export async function clearSearchHistory(): Promise<void> {
  await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
}
