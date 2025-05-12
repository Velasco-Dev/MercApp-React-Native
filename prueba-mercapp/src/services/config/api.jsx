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

export const API_URL = 'https://backendmercaapp.onrender.com/api';

export const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

export const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        const error = {
            status: response.status,
            message: data.message || 'Error en la petición',
            details: data.error || null
        };
        
        // Manejar diferentes códigos de estado
        switch (response.status) {
            case 401:
                error.message = 'No autorizado. Por favor, inicie sesión.';
                break;
            case 403:
                error.message = 'Acceso denegado.';
                break;
            case 404:
                error.message = 'Recurso no encontrado.';
                break;
            case 500:
                error.message = 'Error interno del servidor.';
                break;
        }
        
        throw error;
    }
    
    return data;
};

// Función para manejar errores de red
export const handleNetworkError = (error) => {
    console.error('Error de red:', error);
    throw new Error('Error de conexión con el servidor');
};