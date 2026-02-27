import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { theme } from '../../constants/theme';
import { t } from '../../i18n/strings';
import type { ForecastItem, Language, Unit } from '../../types';
import { getWeatherIcon } from '../../utils/weatherIcons';

type ForecastSectionProps = {
  data: ForecastItem[];
  unit: Unit;
  language: Language;
};

export default function ForecastSection({ data, unit, language }: ForecastSectionProps) {
  const unitSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';
  const pointWidth = 72;
  const timelineItems = data;
  if (!timelineItems.length) return null;

  const lineData = timelineItems.map((item) => ({
    value: Math.round(item.main.temp),
    dataPointText: `${Math.round(item.main.temp)}${unitSymbol}`,
    label: '',
  }));

  const lineValues = lineData.map((entry) => entry.value);
  const maxVal = Math.max(...lineValues);
  const paddedMax = maxVal + 3;
  const timelineWidth = Math.max(timelineItems.length * pointWidth, 320);

  const daySummary = useMemo(() => {
    const grouped = new Map<string, number[]>();
    for (const item of timelineItems) {
      const key = new Date(item.dt * 1000).toDateString();
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)?.push(item.main.temp);
    }
    return Array.from(grouped.entries()).slice(0, 3).map(([key, temps], index) => {
      const label = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Day After';
      return {
        key,
        label,
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps)),
      };
    });
  }, [timelineItems]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{t(language, 'home.next72Hours')}</Text>
      <View style={styles.container}>
        <View style={styles.summaryRow}>
          {daySummary.map((day) => (
            <View key={day.key} style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>{day.label}</Text>
              <Text style={styles.summaryRange}>
                {day.min}{unitSymbol} / {day.max}{unitSymbol}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineScrollContent}
        >
          <View style={[styles.timelineContent, { width: timelineWidth }]}>
            <View style={styles.chartContainer}>
              <LineChart
                data={lineData}
                height={170}
                width={timelineWidth}
                initialSpacing={pointWidth / 2}
                spacing={pointWidth}
                hideDataPoints={false}
                dataPointsColor1={theme.colors.text}
                dataPointsRadius={4}
                color1={theme.colors.text}
                thickness1={2.5}
                curved
                hideRules
                hideAxesAndRules
                hideYAxisText
                yAxisLabelWidth={0}
                yAxisThickness={0}
                xAxisThickness={0}
                maxValue={paddedMax}
                textColor1={theme.colors.text}
                textFontSize={13}
              />
            </View>
            <View style={styles.bottomInfoRow}>
              {timelineItems.map((item) => (
                <View key={item.dt} style={styles.hourItem}>
                  <Ionicons
                    name={getWeatherIcon(item.weather[0]?.main || '')}
                    size={22}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.hourDesc} numberOfLines={1}>
                    {item.weather[0]?.main || 'N/A'}
                  </Text>
                  <Text style={styles.hourText}>
                    {new Date(item.dt * 1000).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 36,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  summaryTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryRange: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  timelineScrollContent: {
    paddingHorizontal: theme.spacing.sm,
  },
  chartContainer: {
    marginTop: theme.spacing.sm,
  },
  timelineContent: {
    marginTop: theme.spacing.md,
  },
  bottomInfoRow: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
  },
  hourItem: {
    width: 72,
    alignItems: 'center',
  },
  hourDesc: {
    marginTop: 6,
    color: theme.colors.text,
    fontSize: 12,
    textAlign: 'center',
  },
  hourText: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 12,
  },
});
