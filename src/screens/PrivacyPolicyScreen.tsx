import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} >
            <Text style={styles.title}> Privacy Policy </Text>
            < Text style={styles.text} >
                Your privacy is important to us.It is Weather App's policy to respect your privacy regarding any information we may collect from you through our app.
            </Text>

            < Text style={styles.sectionTitle} > 1. Information We Collect </Text>
            < Text style={styles.text} >
                We only ask for personal information when we truly need it to provide a service to you.We collect it by fair and lawful means, with your knowledge and consent.We also let you know why we’re collecting it and how it will be used.
            </Text>

            < Text style={styles.sectionTitle} > 2. Use of Information </Text>
            < Text style={styles.text} >
                We only retain collected information for as long as necessary to provide you with your requested service.What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
            </Text>

            < Text style={styles.sectionTitle} > 3. Location Data </Text>
            < Text style={styles.text} >
                We use your location data solely to provide accurate weather forecasts for your current area.This data is processed locally or sent to weather data providers anonymously.
            </Text>

            < Text style={styles.sectionTitle} > 4. Sharing of Data </Text>
            < Text style={styles.text} >
                We don't share any personally identifying information publicly or with third-parties, except when required to by law.
            </Text>

            < Text style={styles.sectionTitle} > 5. Contact Us </Text>
            < Text style={styles.text} >
                If you have any questions about how we handle user data and personal information, feel free to contact us.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.primary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: theme.colors.text,
        opacity: 0.8,
    },
});
