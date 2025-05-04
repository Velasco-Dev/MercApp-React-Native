import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { cerrarSesionF } from '../../services/auth/auth.service';

import CustomAlert from './CustomAlert';

const LogoutButton = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();

    const [alertVisible, setAlertVisible] = useState(false);

    const handleLogoutConfirm = async () => {
        try {
            await cerrarSesionF();
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setAlertVisible(true);
        }
    };

    const handleLogout = () => {
        setAlertVisible(true);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.headerButton}
                onPress={handleLogout}
            >
                <Text style={styles.headerButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <CustomAlert
                visible={alertVisible}
                title="Cerrar Sesión"
                message="¿Estás seguro que deseas cerrar sesión?"
                onClose={() => setAlertVisible(false)}
                onConfirm={handleLogoutConfirm}
                showConfirm={true}
            />
        </>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginRight: 15,
        padding: 8,
    },
    headerButtonText: {
        fontSize: 16,
        color: '#FF0000',
    }
});

export default LogoutButton;