import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';
import { cerrarSesionF } from '../../services/auth/auth.service';

import CustomAlert from './CustomAlert';
import { theme } from '../themes/Theme';
import { COLORS } from '../themes/Colors';

import { MaterialIcons } from '@expo/vector-icons';

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
        <View>
            <TouchableOpacity
                style={theme.button.logout}
                onPress={handleLogout}
            >
                <MaterialIcons
                    name="logout"
                    size={20}
                    color={COLORS.BLANCO}
                    style={theme.button.icon}
                />
            </TouchableOpacity>

            <CustomAlert
                visible={alertVisible}
                title="Cerrar Sesión"
                message="¿Estás seguro que deseas cerrar sesión?"
                onClose={() => setAlertVisible(false)}
                onConfirm={handleLogoutConfirm}
                showConfirm={true}
            />
        </View>
    );
};

export default LogoutButton;