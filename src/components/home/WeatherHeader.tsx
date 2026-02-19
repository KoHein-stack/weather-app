import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View, BackHandler } from 'react-native';
import { theme } from '../../constants/theme';
import { searchCity } from '../../services/weatherApi';
import type { GeoCity, SelectedLocation } from '../../types';

type WeatherHeaderProps = {
    cityName: string;
    history?: SelectedLocation[];
    onSearch: (query: string) => void;
    onSelectCity: (city: GeoCity | SelectedLocation) => void;
    onLocationPress: () => void;
};

/**
 * WeatherHeader component: Handles the top navigation bar, city display, 
 * and the integrated search bar with suggestions and history.
 */
export default function WeatherHeader({ 
    cityName, 
    history = [], 
    onSearch, 
    onSelectCity, 
    onLocationPress 
}: WeatherHeaderProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    /**
     * Handles text input changes. Fetches city suggestions from the API 
     * once the input length exceeds 2 characters.
     */
    const handleTextChange = async (text: string) => {
        setQuery(text);
        if (text.trim().length > 2) {
            try {
                const results = await searchCity(text);
                setSuggestions(results);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    /**
     * Selection handler for a search suggestion or a recent search item.
     * Clears the overlay and triggers the parent onSelectCity callback.
     */
    const handleSelectSuggestion = (city: GeoCity | SelectedLocation) => {
        Keyboard.dismiss();
        setQuery('');
        setSuggestions([]);
        setIsFocused(false);
        onSelectCity(city);
    };

    /**
     * Resets the search state and dismisses the keyboard.
     */
    const closeOverlay = () => {
        setQuery('');
        setSuggestions([]);
        setIsFocused(false);
        Keyboard.dismiss();
        return true; // Consumes the back event
    };

    // Hardware back button handler for Android / Swipe back gestures
    // Closes the suggestions overlay if it's currently open
    useEffect(() => {
        const backAction = () => {
            if (isFocused || suggestions.length > 0) {
                return closeOverlay();
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [isFocused, suggestions]);

    const showHistory = isFocused && query.length === 0 && history.length > 0;
    const showSuggestions = suggestions.length > 0;

    return (
        <View style={styles.header}>
            {/* Top row showing current location and profile toggle */}
            <View style={styles.topRow}>
                <Pressable onPress={onLocationPress} style={styles.locationContainer}>
                    <Ionicons name="location" size={18} color={theme.colors.primary} />
                    <Text style={styles.cityName}>{cityName}</Text>
                    {/* <Ionicons name="chevron-down" size={14} color={theme.colors.muted} /> */}
                </Pressable>
                {/* <Pressable style={styles.profileButton}>
                    <Ionicons name="person-circle-outline" size={28} color={theme.colors.text} />
                </Pressable> */}
            </View>

            {/* Search Bar section */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={theme.colors.muted} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search your city..."
                        placeholderTextColor={theme.colors.muted}
                        style={styles.input}
                        value={query}
                        onChangeText={handleTextChange}
                        onFocus={() => setIsFocused(true)}
                        // Delay blurring to allow selection clicks to register
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        onSubmitEditing={() => {
                            if (query.trim()) {
                                Keyboard.dismiss();
                                onSearch(query);
                                setSuggestions([]);
                                setQuery('');
                            }
                        }}
                        returnKeyType="search"
                    />
                </View>

                {/* Suggestions / History Overlay */}
                {(showSuggestions || showHistory) && (
                    <View style={styles.suggestionsContainer}>
                        {showHistory && <Text style={styles.sectionHeader}>Recent Searches</Text>}
                        {(showSuggestions ? suggestions : history).map((item) => (
                            <Pressable
                                key={`${item.lat}-${item.lon}-${'name' in item ? item.name : ''}`}
                                style={styles.suggestionItem}
                                onPress={() => handleSelectSuggestion(item)}
                            >
                                <Ionicons 
                                    name={showHistory ? "time-outline" : "location-outline"} 
                                    size={16} 
                                    color={theme.colors.muted} 
                                />
                                <View>
                                    <Text style={styles.suggestionName}>{item.name}</Text>
                                    <Text style={styles.suggestionSubtext}>
                                        {('state' in item && item.state) ? `${item.state}, ` : ''}{item.country}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cityName: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    profileButton: {
        opacity: 0.8,
    },
    searchContainer: {
        zIndex: 100,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.sm,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    searchIcon: {
        marginRight: theme.spacing.xs,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sectionHeader: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '700',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    suggestionName: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
    suggestionSubtext: {
        color: theme.colors.muted,
        fontSize: 12,
    },
});
