import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { COLORS, theme } from '../../components/themes/Theme';
import { MaterialIcons } from '@expo/vector-icons';

import { PAYMENT_STATUS } from '../../services/config/payment'

export default function PaymentResponseScreen() {

    const route = useRoute();
    const { paymentId, preferenceId, status } = route.params || {};

    const navigation = useNavigation();

    if (!status) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No se pudo determinar el estado del pago.</Text>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => navigation.navigate('Vendor')}
                >
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (status === PAYMENT_STATUS?.SUCCESS) {

        return (
            <View style={theme.container}>
                <View style={[theme.card, styles.container]}>

                    <MaterialIcons name="check-circle" size={64} color={theme.Colors.SUCCESS} />
                    <Text style={styles.title}>¡Pago Exitoso!</Text>
                    <Text style={styles.message}>{'Tu pago ha sido procesado correctamente.'}</Text>{/*message ||*/}

                    {paymentId && (
                        <View style={styles.referenceContainer}>
                            <Text style={styles.referenceLabel}>Referencia de pago:</Text>
                            <Text style={styles.referenceValue}>{paymentId}</Text>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        {/* <TouchableOpacity
                        style={[styles.button, styles.retryButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Reintentar</Text>
                    </TouchableOpacity> */}

                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => navigation.navigate('Vendor')}
                        >
                            <Text style={styles.buttonText}>Volver al Inicio</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

    } else {

        return (
            <View style={[theme.container, {}]}>
                <View style={[theme.card, styles.container]}>

                    <MaterialIcons name="error-outline" size={64} color={theme.Colors.ERROR} />
                    <Text style={styles.title}>Pago No Procesado</Text>
                    <Text style={styles.message}>{'Hubo un problema al procesar tu pago.'}</Text>{/*message ||*/}

                    {paymentId && (
                        <View style={styles.referenceContainer}>
                            <Text style={styles.referenceLabel}>Referencia de intento:</Text>
                            <Text style={styles.referenceValue}>{paymentId}</Text>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        {/* <TouchableOpacity
                        style={[styles.button, styles.retryButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Reintentar</Text>
                    </TouchableOpacity> */}

                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => navigation.navigate('Vendor')}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    icon: {
        fontSize: 48,
        color: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333'
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        color: '#666'
    },
    referenceLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8
    },
    referenceValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    button: {
        backgroundColor: theme.Colors.GRIS,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 400,
        padding: 50,
        alignSelf: 'center',
        paddingVertical: 20,
    },
    referenceContainer: {
        backgroundColor: theme.Colors.BLANCO,
        padding: 16,
        borderRadius: 8,
        marginBottom: 32,
        width: '100%',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: 'auto',
        justifyContent: 'space-between'
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 8,
        alignItems: 'center'
    },
    retryButton: {
        backgroundColor: '#2E86C1'
    },
    cancelButton: {
        backgroundColor: '#95A5A6'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});