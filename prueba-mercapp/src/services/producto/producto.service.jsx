import { API_URL, defaultHeaders, handleResponse, getAuthHeaders } from '../config/api';

export const obtenerProductos = async () => {
    try {
        const response = await fetch(`${API_URL}/productos/`, {
            method: 'GET',
            credentials: 'include',
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

        const headers = await getAuthHeaders();

        const response = await fetch(`${API_URL}/productos/registrar-producto`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(productoData)
        });

        // if (!response.ok) {
        //     const error = await response.json();
        //     throw new Error(error.message || 'Error al crear producto');
        // }

        // return response.json();
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        console.error('Error en crearProducto:', error);
        throw error;
    }
};

// En producto.service.jsx
export const editarProducto = async (id, productoData) => {
    try {
        
        const headers = await getAuthHeaders();
        
        const response = await fetch(`${API_URL}/productos/actualizar-producto/${id}`, {
            method: 'PUT',  // o 'PATCH' según tu API
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(productoData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar el producto');
        }

        return handleResponse(response);
    } catch (error) {
        console.error('Error en editarProducto:', error);
        throw error;
    }
};