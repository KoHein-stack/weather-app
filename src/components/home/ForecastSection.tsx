import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { theme } from '../../constants/theme';
import type { ForecastItem, Unit } from '../../types';
import { getWeatherIcon } from '../../utils/weatherIcons';

type ForecastSectionProps = {
  data: ForecastItem[];
  unit: Unit;
};

export default function ForecastSection({ data, unit }: ForecastSectionProps) {
  const unitSymbol = unit === 'metric' ? '\u00B0C' : '\u00B0F';
  const ITEM_WIDTH = 100;

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

  const allVals = highLineData.concat(lowLineData).map(d => d.value);
  const maxVal = Math.max(...allVals);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Forecast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View>
          <View style={styles.chartWrapper}>
            <LineChart
              data={highLineData}
              data2={lowLineData}
              height={160}
              width={data.length * ITEM_WIDTH}
              initialSpacing={ITEM_WIDTH / 2}
              spacing={ITEM_WIDTH}
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
                  size={28}
                  color={theme.colors.primary}
                />
                <Text style={styles.descText}>{item.weather[0]?.main}</Text>
                <Text style={styles.dateText}>
                  {new Date(item.dt * 1000).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.lg,
    paddingBottom: 40,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  scrollContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  chartWrapper: {
    marginLeft: 0,
    paddingLeft: 0,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  infoCard: {
    width: 100,
    alignItems: 'center',
  },
  descText: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  dateText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.8,
  },
});
