import React, { useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
    Button, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';

import CustomAlert from '../components/common/CustomAlert.jsx';

import { loginUsuarioF } from '../services/auth/auth.service.jsx';

import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {

    const { login } = useAuth();
    // const [users] = useState(initialUsers);

    const [userCorreo, setCorreo] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const validateUser = async () => {

        // Validar que los campos no estén vacíos
        if (!userCorreo || !userPassword) {
            showAlert('Error', 'Por favor ingrese usuario y contraseña');
            return;
        }

        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userCorreo)) {
            showAlert('Error', 'Por favor ingrese un correo electrónico válido');
            return;
        }

        console.log('Intentando login con:', userCorreo, userPassword);
        
        setLoading(true);

        try {
            const response = await loginUsuarioF(userCorreo, userPassword);
            await login(response.token, response.usuario.rol);
            // Si el usuario existe, navegamos a la pantalla correspondiente
            const screenMap = {
                'admin': 'admin',
                'Microempresario': 'Micro',
                'Vendedor': 'Vendor',
                'usuario': 'User' // Agregar esta línea si quieres soporte para usuarios normales

            };

            const screenName = screenMap[response.usuario.rol];
            if (!screenName) {
                throw new Error('Rol no válido o sin acceso');
            }

            //navigation.replace(screenName);
            // const screenName = screenMap[response.usuario.rol];

        } catch (error) {
            console.error('Error al validar usuario:', error);
            showAlert('Error de acceso', error.message || 'Error al validar usuario'); //
            setUserPassword('');
        } finally {
            setLoading(false);
        }
    };

    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.loginForm}>
                        <Text style={styles.title}>Iniciar Sesión</Text>
                        <TextInput
                            autoCapitalize="none"
                            placeholder="Correo"
                            value={userCorreo}
                            onChangeText={setCorreo}
                            keyboardType="email-address"
                            style={styles.input}
                            editable={!loading}
                        />
                        <TextInput
                            secureTextEntry
                            autoCapitalize="none"
                            placeholder="Contraseña"
                            value={userPassword}
                            onChangeText={setUserPassword}
                            style={styles.input}
                            editable={!loading}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.loginButton}
                                    onPress={validateUser}>
                                    <Text style={styles.buttonText}>Ingresar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={() => navigation.navigate('Registro')}>
                                    <Text style={styles.registerButtonText}>¿No tienes una cuenta? Regístrate</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                    <CustomAlert
                        visible={alertVisible}
                        title={alertTitle}
                        message={alertMessage}
                        onClose={() => setAlertVisible(false)}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({


    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#fff',
    },
    loginForm: {
        width: '100%',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 2,
        padding: 20,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%'
    },
    loginButton: {
        backgroundColor: '#4CAF50', // Verde material design
        padding: 15,
        borderRadius: 10,
        width: '40%',
        marginVertical: 10,
    },
    registerButton: {
        padding: 15
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButtonText: {
        color: '#4CAF50',
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});
