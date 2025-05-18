import React from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../themes/Colors';
import { theme } from '../themes/Theme';

import { MaterialIcons } from '@expo/vector-icons';


const CustomAlert = ({ status, visible, title, message, onClose, onConfirm = null, showConfirm = false }) => {

    const getStatusContent = () => {
        switch (status) {
            case 'loading':
                return <ActivityIndicator size="large" color={COLORS.PRIMARY} />;
            case 'success':
                return (
                    <>
                        <MaterialIcons name="check-circle" size={64} color={COLORS.SUCCESS} />
                    </>
                );
            case 'error':
                return (
                    <>
                        <MaterialIcons name="error-outline" size={64} color={COLORS.ERROR} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.alertView}>

                    {getStatusContent()}
                    {title ? <Text style={styles.title}>{title}</Text> : null}
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    {status !== 'loading' && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>Cerrar</Text>
                            </TouchableOpacity>
                            {showConfirm && (
                                <TouchableOpacity
                                    style={[styles.button, styles.confirmButton]}
                                    onPress={() => {
                                        onConfirm?.();
                                        onClose();
                                    }}
                                >
                                    <Text style={styles.buttonText}>Confirmar</Text>
                                </TouchableOpacity>

                            )}
                        </View>
                    )}

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({

    alertView: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Para Android
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 500,
        alignItems: 'center',
        transform: [{ scale: 1 }] // Ayuda con la animación
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    button: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        marginHorizontal: 10
        // backgroundColor: '#2196F3',
        // padding: 10,
        // borderRadius: 5,
        // width: '50%',
        // marginHorizontal: 10
    },
    cancelButton: {
        backgroundColor: '#6c757d'
    },
    confirmButton: {
        backgroundColor: '#dc3545'
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
});

export default CustomAlert;