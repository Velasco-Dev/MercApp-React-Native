import { API_URL, defaultHeaders } from '../config/api';

export const registrarVenta = async (ventaData) => {
    try {
        const response = await fetch(`${API_URL}/ventas`, {
            method: 'POST',
            headers: defaultHeaders,
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

export const obtenerVentas = async () => {
    try {
        const response = await fetch(`${API_URL}/ventas`, {
            method: 'GET',
            headers: defaultHeaders,
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