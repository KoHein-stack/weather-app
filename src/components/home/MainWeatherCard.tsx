import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import type { Unit } from '../../types';

type MainWeatherCardProps = {
    temp: number;
    description: string;
    unit: Unit;
};

/**
 * MainWeatherCard: Displays the current temperature, weather icon, 
 * and a short description (e.g., "Clear Sky").
 */
export default function MainWeatherCard({ temp, description, unit }: MainWeatherCardProps) {
    // Dynamic unit symbol display
    const unitSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Visual weather indicator */}
                <Ionicons 
                    name="partly-sunny" 
                    size={80} 
                    color={theme.colors.primary} 
                    style={styles.icon} 
                />
                
                {/* Temperature and Unit display */}
                <View style={styles.tempContainer}>
                    <Text style={styles.temp}>{Math.round(temp)}</Text>
                    <Text style={styles.unit}>{unitSymbol}</Text>
                </View>
                
                {/* Human-readable weather description */}
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: theme.spacing.lg,
    },
    content: {
        alignItems: 'center',
    },
    icon: {
        marginBottom: -10,
    },
    tempContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    temp: {
        color: theme.colors.text,
        fontSize: 100,
        fontWeight: '200',
        letterSpacing: -4,
    },
    unit: {
        color: theme.colors.primary,
        fontSize: 40,
        fontWeight: '400',
        marginTop: 20,
    },
    description: {
        color: theme.colors.muted,
        fontSize: 20,
        textTransform: 'capitalize',
        marginTop: -10,
        fontWeight: '400',
    },
});
