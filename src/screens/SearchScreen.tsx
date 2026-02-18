import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView
} from 'react-native';
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
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const { setSelectedLocation } = useSettings();
  const { data, loading, error, execute } = useWeather(searchCity);

  useEffect(() => {
    void getSearchHistory().then(setHistory);
  }, []);

  // Debounce suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      const result = await execute(query, 5);
      if (result) {
        setSuggestions(result);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const onSearch = async (): Promise<void> => {
    await execute(query, 8);
    setSuggestions([]);
  };

  const onSelectLocation = async (
    item: GeoCity | SelectedLocation
  ): Promise<void> => {
    const location: SelectedLocation = {
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      country: item.country
    };

    setSelectedLocation(location);

    const updated = await saveSearchHistory(location);
    setHistory(updated);

    setQuery(`${item.name}, ${item.country ?? ''}`.trim());
    setSuggestions([]);
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
        returnKeyType="search"
        onSubmitEditing={() => void onSearch()}
      />

      <Pressable style={styles.button} onPress={() => void onSearch()}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionDropdown}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {suggestions.map((item, index) => (
              <Pressable
                key={`${item.name}-${item.lat}-${item.lon}`}
                onPress={() => void onSelectLocation(item)}
                style={[
                  styles.suggestionItem,
                  index !== suggestions.length - 1 && styles.divider
                ]}
              >
                <View style={styles.suggestionContent}>
                  <Text style={styles.resultText}>{item.name}</Text>
                  <Text style={styles.suggestionSubText}>
                    {item.state ? `${item.state}, ` : ''}
                    {item.country}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {loading && <LoadingState message="Searching cities..." />}
      {!!error && <ErrorState error={error} />}

      {suggestions.length === 0 && (
        <SearchHistoryList
          history={history}
          onSelect={(item) => void onSelectLocation(item)}
        />
      )}
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

  /* Professional Suggestion Dropdown */
  suggestionDropdown: {
    position: 'absolute',
    top: 140,
    left: theme.spacing.md,
    right: theme.spacing.md,
    borderRadius: theme.radius.md,
    maxHeight: 250,
    zIndex: 1000,
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },
  suggestionItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm
  },
  suggestionContent: {
    flexDirection: 'column'
  },
  suggestionSubText: {
    fontSize: 13,
    opacity: 0.7
  },
  resultText: {
    color: theme.colors.text
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#334155'
  }
});
