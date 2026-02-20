import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function UserAgreementScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} >
            <Text style={styles.title}> User Agreement </Text>
            < Text style={styles.text} >
                Welcome to the Weather App.By using this application, you agree to the following terms and conditions:
            </Text>

            < Text style={styles.sectionTitle} > 1. Acceptance of Terms </Text>
            < Text style={styles.text} >
                By accessing or using the Weather App, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </Text>

            < Text style={styles.sectionTitle} > 2. Use License </Text>
            < Text style={styles.text} >
                Permission is granted to temporarily download one copy of the materials(information or software) on Weather App's website for personal, non-commercial transitory viewing only.
            </Text>

            < Text style={styles.sectionTitle} > 3. Disclaimer </Text>
            < Text style={styles.text} >
                The materials on Weather App's website are provided on an ' as is' basis. Weather App makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </Text>

            < Text style={styles.sectionTitle} > 4. Limitations </Text>
            < Text style={styles.text} >
                In no event shall Weather App or its suppliers be liable for any damages(including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Weather App's website.
            </Text>

            < Text style={styles.sectionTitle} > 5. Accuracy of Materials </Text>
            < Text style={styles.text} >
                The materials appearing on Weather App's website could include technical, typographical, or photographic errors. Weather App does not warrant that any of the materials on its website are accurate, complete or current.
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
