import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { formatDayLabel } from '../../utils/date';
import type { ForecastItem, Unit } from '../../types';

type ForecastSectionProps = {
    data: ForecastItem[];
    unit: Unit;
};

export default function ForecastSection({ data, unit }: ForecastSectionProps) {
    const unitSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Forecast</Text>
            <View style={styles.list}>
                {data.map((item, index) => (
                    <View key={item.dt} style={[styles.item, index === data.length - 1 && styles.lastItem]}>
                        <Text style={styles.day}>{formatDayLabel(item.dt)}</Text>
                        <View style={styles.rightContent}>
                            <Text style={styles.desc}>{item.weather[0]?.description}</Text>
                            <Text style={styles.temp}>{Math.round(item.main.temp)}{unitSymbol}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.lg,
        paddingBottom: 40,
    },
    title: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
    },
    list: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    day: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    desc: {
        color: theme.colors.muted,
        fontSize: 14,
        textTransform: 'capitalize',
    },
    temp: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '700',
        width: 50,
        textAlign: 'right',
    },
});
