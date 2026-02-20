import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider } from './src/context/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SettingsProvider>
    <StatusBar style= "light" />
    <AppNavigator />
    </SettingsProvider>
  );
}
