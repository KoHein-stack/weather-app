import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { theme } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserAgreementScreen from '../screens/UserAgreementScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

type SettingsStackParamList = {
  SettingsHome: undefined;
  UserAgreement: undefined;
  PrivacyPolicy: undefined;
};

const SettingsStack = createStackNavigator<SettingsStackParamList>();

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#111827' },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }
      }
    >
      <SettingsStack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      < SettingsStack.Screen
        name="UserAgreement"
        component={UserAgreementScreen}
        options={{ title: 'User Agreement' }}
      />
      < SettingsStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
    </SettingsStack.Navigator>
  );
}

type TabParamList = {
  Home: undefined;
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

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme} >
      <Tab.Navigator
        screenOptions={
          ({ route }: { route: RouteProp<TabParamList, keyof TabParamList> }) => ({
            headerStyle: { backgroundColor: '#111827' },
            headerTintColor: theme.colors.text,
            tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1F2937' },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.muted,
            tabBarIcon: ({ color, size }) => {
              const iconMap: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
                Home: 'partly-sunny',
                Settings: 'settings'
              };
              return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
            }
          })
        }
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }
          }
        />
        < Tab.Screen
          name="Settings"
          component={SettingsStackNavigator}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
