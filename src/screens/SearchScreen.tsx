import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import SearchHistoryList from '../components/SearchHistoryList';
import { theme } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import useWeather from '../hooks/useWeather';
import { searchCity } from '../services/weatherApi';
import { getSearchHistory, saveSearchHistory } from '../store/searchHistory';
import type { GeoCity, SelectedLocation } from '../types';

export default function SearchScreen(): JSX.Element {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<SelectedLocation[]>([]);
  const { setSelectedLocation } = useSettings();
  const { data, loading, error, execute, setData } = useWeather(searchCity);

  useEffect(() => {
    void getSearchHistory().then(setHistory);
  }, []);

  const onSearch = async (): Promise<void> => {
    await execute(query, 8);
  };

  const onSelectLocation = async (item: GeoCity | SelectedLocation): Promise<void> => {
    const location: SelectedLocation = {
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      country: item.country
    };
    setSelectedLocation(location);
    const updated = await saveSearchHistory(location);
    setHistory(updated);
    setData([]);
    setQuery(`${item.name}, ${item.country ?? ''}`.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search City</Text>
      <TextInput
        placeholder="Search by city name"
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      <Pressable style={styles.button} onPress={() => void onSearch()}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>

      {loading && <LoadingState message="Searching cities..." />}
      {!!error && <ErrorState error={error} />}

      <View style={styles.results}>
        {data?.map((item) => (
          <Pressable
            key={`${item.name}-${item.lat}-${item.lon}`}
            onPress={() => void onSelectLocation(item)}
            style={styles.resultItem}
          >
            <Text style={styles.resultText}>{item.name}, {item.state ? `${item.state}, ` : ''}{item.country}</Text>
          </Pressable>
        ))}
      </View>

      <SearchHistoryList history={history} onSelect={(item) => void onSelectLocation(item)} />
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
    marginBottom: theme.spacing.md
  },
  input: {
    backgroundColor: theme.colors.card,
    borderColor: '#334155',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm
  },
  buttonText: {
    color: '#020617',
    fontWeight: '700'
  },
  results: {
    marginTop: theme.spacing.sm
  },
  resultItem: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.sm
  },
  resultText: {
    color: theme.colors.text
  }
});
