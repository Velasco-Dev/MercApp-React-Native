import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterButton = () => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Registro');
    };

    return (
        <TouchableOpacity 
            style={styles.registerButton}
            onPress={handlePress}
        >
            <Text style={styles.buttonText}>Regístrate</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    registerButton: {
        backgroundColor: '#4CAF50', // Verde material design
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        elevation: 2, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default RegisterButton;