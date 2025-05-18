import { API_URL, defaultHeaders, getAuthHeaders } from '../config/api';


export const obtenerUsuarios = async () => {
    
    const headers = await getAuthHeaders();

    try {
        const response = await fetch(`${API_URL}/admin/usuarios`, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error in obtenerUsuarios:', error); // Debug
        throw error;
    }
};

export const crearUsuario = async (userData) => {

    const headers = await getAuthHeaders();
    
    try {
        const response = await fetch(`${API_URL}/admin/register`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
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

    const headers = await getAuthHeaders();

    try {
        const response = await fetch(`${API_URL}/admin/update/${userId}`, {
            method: 'PUT',
            headers: headers,
            credentials: 'include',
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

    const headers = await getAuthHeaders();


    try {
        const response = await fetch(`${API_URL}/usuarios/${userId}`, {
            method: 'DELETE',
            headers: headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};