import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, TextInput,
    ImageBackground, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
    Image, Animated
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomAlert from '../components/common/CustomAlert.jsx';

import { loginUsuarioF } from '../services/auth/auth.service.jsx';

import { useAuth } from '../context/AuthContext';
import { theme } from '../components/themes/Theme.jsx';
import { COLORS } from '../components/themes/Colors.jsx';

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

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start();
    }, []);

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

            // Verifica que la respuesta tenga la estructura correcta
            if (response && response.success) {
                await login(
                    // response.token,
                    response.data.rol,
                    response.data.idPersona
                );

                console.log('Login exitoso:', response.data.idPersona);
                console.log('Async userToken exitoso:', AsyncStorage.getItem('userToken'));

            } else {
                throw new Error('Respuesta del servidor inválida');
            }
        } catch (error) {

            console.error('Error al validar usuario:', error);
            showAlert('Error de acceso', error.message || 'Error al validar usuario');
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
            <ImageBackground
                source={require('../../assets/background.webp')} // ajusta la ruta según tu estructura
                style={theme.backgroundImage}
                resizeMode="cover"
                imageStyle={{ opacity: 1 }} // Ajusta la opacidad de la imagen de fondo
            >
                <ScrollView contentContainerStyle={[styles.scrollContainer, theme.container]}
                    keyboardShouldPersistTaps="handled"
                    style={{ flex: 1 }}>

                    <View style={styles.container}>
                        <View style={styles.loginForm}>
                            {/* // En el render, envuelve la Image en un Animated.View: */}
                            <Animated.View style={{ opacity: fadeAnim }}>
                                <Image
                                    source={require('../../assets/icon.png')} // ajusta la ruta según tu estructura
                                    style={theme.logo}
                                    resizeMode="contain"
                                />
                            </Animated.View>
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
                                <ActivityIndicator size="large" color={COLORS.SECONDARY} />
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={theme.button.primary}
                                        onPress={validateUser}>
                                        <Text style={theme.button.textPrimary}>Ingresar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Registro')}>
                                        <Text style={theme.button.registerButtonText}>¿No tienes una cuenta? Regístrate</Text>
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
            </ImageBackground>
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
        backgroundColor: 'rgba(255, 255, 255, 0.63)',
        flex: 1,
        justifyContent: 'center',
        padding: 40,
        alignItems: 'center',
    },
    loginForm: {
        ...Platform.select({
            web: {
                width: '40%', // Más pequeño en web
                maxWidth: 400, // Tamaño máximo para pantallas grandes
                minWidth: 300, // Tamaño mínimo para que sea usable
            },
            default: {
                width: '100%', // Mantiene el 100% en móvil
            }
        }),
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 2,
        padding: 20,
        backgroundColor: COLORS.BLANCO,
        // Reemplaza boxShadow (que no funciona en React Native) por:
        ...Platform.select({
            web: {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            default: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }
        }),
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
        backgroundColor: theme.Colors.PRIMARY,
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
        color: theme.Colors.PRIMARY,
        textAlign: 'center',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});
