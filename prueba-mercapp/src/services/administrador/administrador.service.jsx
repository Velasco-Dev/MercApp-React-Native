import { API_URL, defaultHeaders, getAuthHeaders, handleResponse } from '../config/api';


export const obtenerUsuarios = async () => {
    
    const headers = await getAuthHeaders();

    try {
        const response = await fetch(`${API_URL}/admin/usuarios`, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });

        // if (!response.ok) {
        //     throw new Error('Error al obtener usuarios');
        // }

        // const data = await response.json();
        // return data;
        const data = await handleResponse(response);
        return data;

    } catch (error) {
        console.error('Error in obtenerUsuarios:', error); // Debug
        throw error;
    }
};

export const crearUsuario = async (userData) => {

    const headers = await getAuthHeaders();
    
    try {
        const response = await fetch(`${API_URL}/admin/registrar-usuario`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(userData)
        });

        // if (!response.ok) {
        //     throw new Error('Error al crear usuario');
        // }

        // return response.json();
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        throw error;
    }
};

export const actualizarUsuario = async (userId, userData) => {

    const headers = await getAuthHeaders();

    try {
        const response = await fetch(`${API_URL}/admin/actualizar-usuario/${userId}`, {
            method: 'PUT',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar usuario');
        }

        return await handleResponse(response);
        // return response.json();
        // const data = await handleResponse(response);
        // return data;
    } catch (error) {
        throw new Error(error.message || 'Error al actualizar usuario');
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

        // if (!response.ok) {
        //     throw new Error('Error al eliminar usuario');
        // }

        // return response.json();
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        throw error;
    }
};