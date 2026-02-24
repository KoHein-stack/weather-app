import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { theme } from '../../constants/theme';
import type { ForecastItem, Unit } from '../../types';
import { getWeatherIcon } from '../../utils/weatherIcons';

type WeeklyForecastSectionProps = {
  data: ForecastItem[];
  unit: Unit;
};

export default function WeeklyForecastSection({ data, unit }: WeeklyForecastSectionProps) {
  const unitSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';
  const itemWidth = 88;

  const highLineData = data.map((item) => ({
    value: Math.round(item.main.temp_max),
    dataPointText: `${Math.round(item.main.temp_max)}${unitSymbol}`,
    label: '',
  }));

  const lowLineData = data.map((item) => ({
    value: Math.round(item.main.temp_min),
    dataPointText: `${Math.round(item.main.temp_min)}${unitSymbol}`,
    label: '',
  }));

  const allVals = highLineData.concat(lowLineData).map((entry) => entry.value);
  const maxVal = Math.max(...allVals);

  const timelineWidth = Math.max(data.length * itemWidth, 320);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Weekly Forecast</Text>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineScrollContent}
        >
          <View style={[styles.timelineContent, { width: timelineWidth }]}>
            <View style={styles.chartContainer}>
            <LineChart
              data={highLineData}
              data2={lowLineData}
              height={160}
              width={timelineWidth}
              initialSpacing={itemWidth / 2}
              spacing={itemWidth}
              hideDataPoints={false}
              dataPointsColor1={theme.colors.primary}
              dataPointsColor2={theme.colors.muted}
              dataPointsRadius={4}
              color1={theme.colors.primary}
              color2={theme.colors.muted}
              thickness1={3}
              thickness2={2}
              curved
              curveType={1}
              hideRules
              hideAxesAndRules
              hideYAxisText
              yAxisLabelWidth={0}
              yAxisThickness={0}
              xAxisThickness={0}
              maxValue={maxVal + 5}
              textColor1={theme.colors.text}
              textColor2={theme.colors.muted}
              textFontSize={14}
            />
            </View>
            <View style={styles.infoRow}>
              {data.map((item) => (
                <View key={item.dt} style={styles.infoCard}>
                  <Ionicons
                    name={getWeatherIcon(item.weather[0]?.main || '')}
                    size={22}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.descText}>{item.weather[0]?.main}</Text>
                  <Text style={styles.dateText}>
                    {new Date(item.dt * 1000).toLocaleDateString(undefined, {
                      month: 'numeric',
                      day: 'numeric',
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
    paddingBottom: 40,
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
  timelineScrollContent: {
    paddingHorizontal: theme.spacing.sm,
  },
  timelineContent: {
    marginTop: theme.spacing.md,
  },
  chartContainer: {
    marginTop: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  infoCard: {
    width: 88,
    alignItems: 'center',
  },
  descText: {
    color: theme.colors.text,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
