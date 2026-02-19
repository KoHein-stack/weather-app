import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import type { Unit } from '../../types';

type DetailItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
};

/**
 * Internal component for rendering each weather attribute (Humidity, Wind, etc.)
 */
function DetailItem({ icon, label, value }: DetailItemProps) {
    return (
        <View style={styles.item}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={20} color={theme.colors.primary} />
            </View>
            <View>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

type WeatherDetailsGridProps = {
    humidity: number;
    windSpeed: number;
    visibility?: number;
    pressure: number;
    unit: Unit;
};

/**
 * WeatherDetailsGrid: Displays secondary weather data in a 2x2 grid layout.
 */
export default function WeatherDetailsGrid({ 
    humidity, 
    windSpeed, 
    visibility, 
    pressure, 
    unit 
}: WeatherDetailsGridProps) {
    // Adapt speed units based on global app settings
    const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

    return (
        <View style={styles.grid}>
            <DetailItem 
                icon="water-outline" 
                label="Humidity" 
                value={`${humidity}%`} 
            />
            <DetailItem 
                icon="speedometer-outline" 
                label="Wind" 
                value={`${windSpeed} ${speedUnit}`} 
            />
            <DetailItem 
                icon="eye-outline" 
                label="Visibility" 
                value={`${(visibility ?? 10000) / 1000} km`} 
            />
            <DetailItem 
                icon="thermometer-outline" 
                label="Pressure" 
                value={`${pressure} hPa`} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    item: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        width: '47%',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    iconContainer: {
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        padding: 8,
        borderRadius: 10,
    },
    label: {
        color: theme.colors.muted,
        fontSize: 12,
        fontWeight: '500',
    },
    value: {
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
});
