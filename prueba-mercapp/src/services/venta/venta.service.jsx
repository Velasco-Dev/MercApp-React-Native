import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, defaultHeaders, getAuthHeaders } from '../config/api';

export const obtenerVentas = async () => {

    const headers = await getAuthHeaders();
    const idVendedor = await AsyncStorage.getItem('idPersona');

    try {
        const response = await fetch(`${API_URL}/ventas/${idVendedor}`, {
            method: 'GET',
            headers: headers,
            credentials: 'include',

        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener las ventas');
        }

        return response.json();
    } catch (error) {
        console.error('Error en obtenerVentas:', error);
        throw error;
    }
};

export const crearVenta = async (ventaData) => {

    const headers = await getAuthHeaders();

    try {

        const response = await fetch(`${API_URL}/ventas/registrar-venta`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(ventaData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al registrar la venta');
        }

        return response.json();
    } catch (error) {
        console.error('Error en registrarVenta:', error);
        throw error;
    }
};
