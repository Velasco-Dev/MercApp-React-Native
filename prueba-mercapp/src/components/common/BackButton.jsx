import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../themes/Theme';


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
            <Ionicons name="arrow-back" size={24} color={theme.Colors.TEXT} />
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