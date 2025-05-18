import { useState, useCallback, useEffect } from 'react';
import {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} from '../administrador/administrador.service';

export const useUsuarios = () => {
    const [usuarios, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await obtenerUsuarios();
            // console.log('Datos recibidos:', data);
            setUsers(data);
            setError(null);
            // Extraer el array de usuarios de la respuesta
            // const userData = response.usuarios;
            
            // if (!userData || !Array.isArray(userData)) {
            //     throw new Error('Formato de datos inválido');
            // }

            // setUsers(userData);
            // setError(null);
        } catch (err) {
            console.error('Error en fetchUsers:', err);
            setError(err.message);
            setUsers([]); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const addUser = useCallback(async (userData) => {
        try {
            setLoading(true);
            await crearUsuario(userData);
            await fetchUsers();
            setError(null);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const updateUser = useCallback(async (userId, userData) => {
        try {
            setLoading(true);
            await actualizarUsuario(userId, userData);
            await fetchUsers();
            setError(null);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const deleteUser = useCallback(async (userId) => {
        try {
            setLoading(true);
            await eliminarUsuario(userId);
            await fetchUsers();
            setError(null);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    return {
        usuarios,
        loading,
        error,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser
    };
};