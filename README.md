# Weather Mobile App (Expo + React Native + TypeScript)

Production-ready weather app starter using React Native + Expo, React Navigation, TypeScript, and OpenWeather API.

## Features

- 4 screens: Home, Search, Forecast, Settings
- Functional components + React Hooks
- TypeScript across the full app
- API integration with loading and error states
- Modern dark UI
- `.env` API key setup
- Bonus advanced features:
  - **Location detection** (auto-load local weather)
  - **Search history** persisted in local storage

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Add your OpenWeather key in `.env`.
4. Run typecheck (recommended):
   ```bash
   npm run typecheck
   ```
5. Start app:
   ```bash
   npm start
   ```

## Expo build commands

### Development run commands

```bash
# Start Metro
npm start

# Run on Android (requires Android Studio/emulator)
npm run android

# Run on iOS (macOS + Xcode only)
npm run ios

# Run web
npm run web
```

### Production builds with EAS

```bash
# Install EAS CLI (once)
npm install -g eas-cli

# Login
eas login

# Configure project (first time)
eas build:configure

# Android APK (internal testing)
eas build -p android --profile preview

# Android AAB (store release)
eas build -p android --profile production

# iOS build (TestFlight/App Store profile)
eas build -p ios --profile production
```

## Required packages

- expo
- react-native
- typescript
- @types/react
- @react-navigation/native
- @react-navigation/bottom-tabs
- react-native-screens
- react-native-safe-area-context
- expo-location
- @react-native-async-storage/async-storage

## Project structure

```txt
weather-mobile-app/
├── App.tsx
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── components/
    ├── constants/
    ├── context/
    ├── hooks/
    ├── navigation/
    ├── screens/
    ├── services/
    ├── store/
    ├── types.ts
    └── utils/
```
