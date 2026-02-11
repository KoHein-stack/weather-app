import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import type { SelectedLocation } from '../types';

type SearchHistoryListProps = {
  history: SelectedLocation[];
  onSelect: (item: SelectedLocation) => void;
};

export default function SearchHistoryList({ history, onSelect }: SearchHistoryListProps): JSX.Element | null {
  if (!history.length) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Recent Searches</Text>
      {history.map((item) => (
        <Pressable
          key={`${item.name}-${item.lat}-${item.lon}`}
          onPress={() => onSelect(item)}
          style={styles.item}
        >
          <Text style={styles.itemText}>{item.name}, {item.country}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: theme.spacing.lg
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.sm
  },
  item: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xs,
    padding: theme.spacing.sm
  },
  itemText: {
    color: theme.colors.text
  }
});
