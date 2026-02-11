import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { theme } from '../constants/theme';
import ForecastScreen from '../screens/ForecastScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

type TabParamList = {
  Home: undefined;
  Search: undefined;
  Forecast: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: '#111827',
    text: theme.colors.text,
    border: '#1F2937'
  }
};

export default function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: theme.colors.text,
          tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1F2937' },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.muted,
          tabBarIcon: ({ color, size }) => {
            const iconMap: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
              Home: 'partly-sunny',
              Search: 'search',
              Forecast: 'calendar',
              Settings: 'settings'
            };
            return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Forecast" component={ForecastScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
