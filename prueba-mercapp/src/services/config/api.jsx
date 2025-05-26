import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cerrarSesionF } from '../auth/auth.service';

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
    'Access-Control-Allow-Credentials': 'true',
    'Accept': 'application/json'
};

export const getAuthHeaders = async () => {

    const token = await AsyncStorage.getItem('userToken');

    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const handleResponse = async (response) => {

    // console.log(response);

    if (response.status === 403  || response.message === 'Token inválido o expirado') {
        // Token expirado o sesión inválida
        console.warn("Sesión expirada. Cerrando sesión...");
        await cerrarSesionF();
        await AsyncStorage.removeItem('userToken'); // si usas tokens locales

        // Puedes lanzar un error para que el contexto lo detecte
        throw new Error('Sesión expirada');
    }

    if (response.status === 400 ) {
        // Token expirado o sesión inválida
        console.warn("Error 400");
    }

    const data = await response.json();
    // console.log(data);

    if (!response.ok) {
        const error = data?.error || 'Error en la solicitud';

        // Manejar diferentes códigos de estado
        // switch (response.status) {
        //     case 401:
        //         error.message = 'No autorizado. Por favor, inicie sesión.';
        //         break;
        //     case 403:
        //         error.message = 'Acceso denegado.';
        //         break;
        //     case 404:
        //         error.message = 'Recurso no encontrado.';
        //         break;
        //     case 500:
        //         error.message = 'Error interno del servidor.';
        //         break;
        // }

        throw new Error(error);
    }

    return data;
};

// Función para manejar errores de red
export const handleNetworkError = (error) => {
    console.error('Error de red:', error);
    throw new Error('Error de conexión con el servidor');
};