import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.canGoBack() && navigation.goBack();
    };

    return (
        <TouchableOpacity 
            style={styles.headerButton}
            onPress={handlePress}
        >
            <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginLeft: 15,
        padding: 8,
    },
    headerButtonText: {
        fontSize: 24,
        color: '#007AFF',
    }
});

export default BackButton;