import type { Language } from '../types';

type TranslationKey =
  | 'settings.preferences'
  | 'settings.temperatureUnit'
  | 'settings.language'
  | 'settings.about'
  | 'settings.userAgreement'
  | 'settings.privacyPolicy'
  | 'settings.versionNumber'
  | 'settings.english'
  | 'settings.myanmar'
  | 'settings.celsius'
  | 'settings.fahrenheit'
  | 'home.searchPlaceholder'
  | 'home.recentSearches'
  | 'home.clear'
  | 'home.searchLocation'
  | 'home.yourLocation'
  | 'home.updated'
  | 'home.fetchingWeather'
  | 'home.loadingForecast';

const strings: Record<Language, Record<TranslationKey, string>> = {
  en: {
    'settings.preferences': 'Preferences',
    'settings.temperatureUnit': 'Temperature Unit',
    'settings.language': 'Language',
    'settings.about': 'About',
    'settings.userAgreement': 'User Agreement',
    'settings.privacyPolicy': 'Privacy Policy',
    'settings.versionNumber': 'Version Number',
    'settings.english': 'English',
    'settings.myanmar': 'Myanmar',
    'settings.celsius': 'Celsius (deg C)',
    'settings.fahrenheit': 'Fahrenheit (deg F)',
    'home.searchPlaceholder': 'Search your city...',
    'home.recentSearches': 'Recent Searches',
    'home.clear': 'Clear',
    'home.searchLocation': 'Search Location',
    'home.yourLocation': 'Your location',
    'home.updated': 'Updated',
    'home.fetchingWeather': 'Fetching weather...',
    'home.loadingForecast': 'Loading forecast',
  },
  mm: {
    'settings.preferences': 'ဆက်တင်များ',
    'settings.temperatureUnit': 'အပူချိန်ယူနစ်',
    'settings.language': 'ဘာသာစကား',
    'settings.about': 'အကြောင်းအရာ',
    'settings.userAgreement': 'အသုံးပြုသူ သဘောတူညီချက်',
    'settings.privacyPolicy': 'ကိုယ်ရေးအချက်အလက် မူဝါဒ',
    'settings.versionNumber': 'ဗားရှင်းနံပါတ်',
    'settings.english': 'အင်္ဂလိပ်',
    'settings.myanmar': 'မြန်မာ',
    'settings.celsius': 'စင်တီဂရိတ် (deg C)',
    'settings.fahrenheit': 'ဖာရန်ဟိုက် (deg F)',
    'home.searchPlaceholder': 'မြို့ကို ရှာဖွေပါ...',
    'home.recentSearches': 'မကြာသေးမီ ရှာဖွေမှုများ',
    'home.clear': 'ဖျက်မည်',
    'home.searchLocation': 'တည်နေရာ ရှာဖွေမည်',
    'home.yourLocation': 'သင့်တည်နေရာ',
    'home.updated': 'နောက်ဆုံးပြင်ဆင်ချိန်',
    'home.fetchingWeather': 'ရာသီဥတု ဒေတာကို ရယူနေသည်...',
    'home.loadingForecast': 'ခန့်မှန်းချက်ကို တင်နေသည်',
  },
};

export function t(language: Language, key: TranslationKey): string {
  return strings[language][key];
}

