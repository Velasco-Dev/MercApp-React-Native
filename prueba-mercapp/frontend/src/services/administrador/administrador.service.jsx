import { API_URL, defaultHeaders } from '../config/api';

export const obtenerUsuarios = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'GET',
            headers: defaultHeaders,
        });

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const data = await response.json();
        console.log('Response from API:', data); // Debug
        return data;

    } catch (error) {
        console.error('Error in obtenerUsuarios:', error); // Debug
        throw error;
    }
};

export const crearUsuario = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/admin/register-users`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error al crear usuario');
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};

export const actualizarUsuario = async (userId, userData) => {
    try {
        const response = await fetch(`${API_URL}/admin/get-user/${userId}`, {
            method: 'PUT',
            headers: defaultHeaders,
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar usuario');
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};

export const eliminarUsuario = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/usuarios/${userId}`, {
            method: 'DELETE',
            headers: defaultHeaders,
        });

        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};