import { API_URL, defaultHeaders } from '../config/api';

export const obtenerProductos = async () => {
    try {
        const response = await fetch(`${API_URL}/products/products`, {
            method: 'GET',
            headers: defaultHeaders,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al obtener productos');
        }

        return response.json();
    } catch (error) {
        console.error('Error en obtenerProductos:', error);
        throw error;
    }
};

export const crearProducto = async (productoData) => {
    try {
        const response = await fetch(`${API_URL}/products/register-product`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(productoData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear producto');
        }

        return response.json();
    } catch (error) {
        console.error('Error en crearProducto:', error);
        throw error;
    }
};