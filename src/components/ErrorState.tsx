import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type ErrorStateProps = {
  error: string;
  onRetry?: () => void;
};

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{error}</Text>
      {!!onRetry && (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  title: {
    color: theme.colors.error,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.xs
  },
  message: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
    textAlign: 'center'
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  buttonText: {
    color: '#020617',
    fontWeight: '700'
  }
});
