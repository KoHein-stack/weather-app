import { Ionicons } from '@expo/vector-icons';

/**
 * Maps weather condition strings to relevant Ionicons names.
 * Optimized for OpenWeatherMap 'main' weather categories.
 */
export const getWeatherIcon = (main: string): keyof typeof Ionicons.glyphMap => {
    const m = main.toLowerCase();

    if (m.includes('thunderstorm')) return 'thunderstorm-outline';
    if (m.includes('drizzle')) return 'rainy-outline';
    if (m.includes('rain')) return 'rainy-outline';
    if (m.includes('snow')) return 'snow-outline';

    // Atmosphere conditions
    if (m.includes('mist') || m.includes('fog') || m.includes('haze') ||
        m.includes('smoke') || m.includes('dust') || m.includes('ash')) {
        return 'cloud-outline';
    }

    if (m.includes('squall') || m.includes('tornado')) return 'alert-outline';

    if (m.includes('clear') || m.includes('sun')) return 'sunny-outline';
    if (m.includes('cloud')) return 'cloud-outline';

    return 'partly-sunny-outline';
};
