import { Platform } from 'react-native';

// Función para obtener la URL base de la API según la plataforma
const getApiUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:4000/api';
    } else if (Platform.OS === 'ios') {
        return 'http://localhost:4000/api';
    } else {
        return 'http://localhost:4000/api';
    }
};

export const API_URL = getApiUrl();

export const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: 'Error de conexión con el servidor'
        }));
        throw new Error(error.message || 'Error en la petición');
    }
    return response.json();
};

// Función para manejar errores de red
export const handleNetworkError = (error) => {
    console.error('Error de red:', error);
    throw new Error('Error de conexión con el servidor');
};