import { API_URL, defaultHeaders, handleResponse } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUsuarioF = async (correo, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: defaultHeaders,
            credentials: 'include',
            body: JSON.stringify({ correo, password })
        });

        // if (!response.ok) {
        //     const dataError = await response.json();
        //     throw new Error(dataError.error || 'Inicio Fallido', response.status);
        // }
        const data = await response.json();

        if (data.success) {
            await AsyncStorage.setItem('userToken', data.token);
        }

        return data;

        // return response.json();
    } catch (error) {
        console.error('Error en loginUsuarioF:', error);
        throw error;
    }
};

export const cerrarSesionF = async () => {
    try {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: defaultHeaders,
            credentials: 'include'
        });

        // if (!response.ok) {
        //     const dataError = await response.json();
        //     throw new Error(dataError.error || 'Cierre Fallido', response.status);
        // }

        // return response.json();
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        console.error('Error en logoutUsuarioF:', error);
        throw error;
    }
};

export const registrarUsuarioF = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/registro`, {
            method: 'POST',
            headers: defaultHeaders,
            credentials: 'include',
            body: JSON.stringify({
                rol: userData.rol,
                estadoPersona: userData.estadoPersona || true,
                nombrePersona: userData.nombrePersona,
                apellido: userData.apellido,
                edad: userData.edad,
                identificacion: userData.identificacion,
                correo: userData.correo,
                password: userData.password
            })
        });

        // if (!response.ok) {
        //     const dataError = await response.json();
        //     throw new Error(dataError.error || 'Creación fallida', response.status);
        // }

        // return await response.json();
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        // throw new Error(error.message || 'Error de conexión con el servidor');
        console.error('Error en registrarUsuarioF:', error);
        throw error;
    }
};