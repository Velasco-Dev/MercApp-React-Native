import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, defaultHeaders, getAuthHeaders, handleResponse } from '../config/api';

export const obtenerVentasAdmin = async () => {

    const headers = await getAuthHeaders();

    try {
        const response = await fetch(`${API_URL}/admin/ventas`, {
            method: 'GET',
            headers: headers,
            credentials: 'include',

        });
        
        const data = await handleResponse(response);
        return data;

        // if (!response.ok) {
        //     const error = await response.json();
        //     throw new Error(error.message || 'Error al obtener las ventas Admin');
        // }

        // return response.json();
    } catch (error) {
        console.error('Error en obtenerVentas Admin:', error);
        throw error;
    }
};

export const obtenerVentasAdminId = async () => {

    const headers = await getAuthHeaders();
    const idVendedor = await AsyncStorage.getItem('idPersona');


    try {
        const response = await fetch(`${API_URL}/admin/ventas/${idVendedor}`, {
            method: 'GET',
            headers: headers,
            credentials: 'include',

        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener las ventas Admin');
        }

        return response.json();
    } catch (error) {
        console.error('Error en obtenerVentas Admin:', error);
        throw error;
    }
};

export const obtenerProductosAdmin = async () => {

    const headers = await getAuthHeaders();

    try {
        const response = await fetch(`${API_URL}/admin/listar-productos`, {
            method: 'GET',
            headers: headers,
            credentials: 'include',

        });

        const data = await handleResponse(response);
        return data;

        // if (!response.ok) {
        //     const error = await response.json();
        //     throw new Error(error.message || 'Error al obtener las ventas Admin');
        // }

        // return response.json();
    } catch (error) {
        console.error('Error en obtenerVentas Admin:', error);
        throw error;
    }
};
