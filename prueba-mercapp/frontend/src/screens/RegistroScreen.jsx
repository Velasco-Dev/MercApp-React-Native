import React, { useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, ScrollView,
    KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import CustomAlert from '../components/common/CustomAlert.jsx';

import { registrarUsuarioF } from '../services/auth/auth.service';

export default function RegistroScreen({ navigation }) {

    const [formData, setFormData] = useState({
        nombrePersona: '',
        apellido: '',
        edad: '',
        identificacion: 0,
        correo: '',
        password: '',
        rol: 'usuario'
    });

    const [loading, setLoading] = useState(false);

    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    const showAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handlePasswordChange = (text) => {
        setFormData({ ...formData, password: text });
        if (verifyPassword && text !== verifyPassword) {
            setPasswordError('Las contraseñas no coinciden');
        } else {
            setPasswordError('');
        }
    };

    const handleVerifyPasswordChange = (text) => {
        setVerifyPassword(text);
        if (formData.password && text !== formData.password) {
            setPasswordError('Las contraseñas no coinciden');
        } else {
            setPasswordError('');
        }
    };

    const handleRegistro = async () => {

        // Validar que los campos no estén vacíos o sean solo espacios en blanco
        const camposRequeridos = [
            'nombrePersona',
            'apellido',
            'edad',
            'identificacion',
            'correo',
            'password'
        ];

        const camposVacios = camposRequeridos.filter(
            campo => !formData[campo] || formData[campo].trim() === ''
        );

        if (camposVacios.length > 0) {
            showAlert('Error', `Los siguientes campos son obligatorios: ${camposVacios.join(', ')}`);
            return;
        }

        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            showAlert('Error', 'Por favor ingrese un correo electrónico válido');
            return;
        }

        // Validar que edad e identificación sean números
        if (isNaN(formData.edad) || isNaN(formData.identificacion)) {
            showAlert('Error', 'La edad y la identificación deben ser números');
            return;
        }

        console.log('Datos de registro válidos:', formData);

        // Validar que las contraseñas coincidan
        if (formData.password !== verifyPassword) {
            showAlert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const response = await registrarUsuarioF(formData);
            //Navegamos a la pantalla correspondiente

            if (response.status === 'success') {
                showAlert('Registro de usuario', response.message || 'Usuario registrado con éxito');
                navigation.replace('Login');
                // Limpiamos los campos
                setFormData('');
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            showAlert('Error de registro', error.message || 'Error al crear usuario');
            setPasswordError('');
            setVerifyPassword('');
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
                    <View style={styles.registerForm}>
                        <Text style={styles.title}>Formulario de Registro</Text>
                        <TextInput
                            placeholder="Nombre"
                            value={formData.nombrePersona}
                            onChangeText={(text) => setFormData({ ...formData, nombrePersona: text })}
                            style={styles.input}
                            editable={!loading}
                        />
                        <TextInput
                            placeholder="Apellido"
                            value={formData.apellido}
                            onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                            style={styles.input}
                            editable={!loading}
                        />
                        <TextInput
                            placeholder="Edad"
                            value={formData.edad}
                            onChangeText={(text) => setFormData({ ...formData, edad: text })}
                            keyboardType="numeric"
                            style={styles.input}
                            editable={!loading}
                        />
                        <TextInput
                            placeholder="Identificación"
                            value={formData.identificacion}
                            onChangeText={(text) => {
                                const numeric = text.replace(/[^0-9]/g, ''); // Solo permitir números
                                setFormData({ ...formData, identificacion: numeric })
                            }}
                            keyboardType="numeric"
                            style={styles.input}
                            editable={!loading}
                        />
                        <TextInput
                            autoCapitalize="none"
                            placeholder="Correo"
                            value={formData.correo}
                            onChangeText={(text) => setFormData({ ...formData, correo: text })}
                            keyboardType="email-address"
                            style={styles.input}
                            editable={!loading}
                        />
                        <TextInput
                            autoCapitalize="none"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChangeText={handlePasswordChange}
                            style={styles.input}
                            editable={!loading}
                        />
                        <TextInput
                            autoCapitalize="none"
                            placeholder="Verificar Contraseña"
                            value={verifyPassword}
                            onChangeText={handleVerifyPasswordChange}
                            style={[styles.input, passwordError ? styles.inputError : null]}
                            editable={!loading}
                        />
                        {passwordError ? (
                            <Text style={styles.errorText}>{passwordError}</Text>
                        ) : null}
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <Button
                                title="Ingresar"
                                onPress={handleRegistro}
                            />
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

    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -5,
        marginBottom: 5,
        alignSelf: 'flex-start'
    },
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
    registerForm: {
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
    }
});
