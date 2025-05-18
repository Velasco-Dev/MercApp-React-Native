import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const [userId, setUserId] = useState(null);


    // Verificar token al iniciar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const role = await AsyncStorage.getItem('rol');
            const id = await AsyncStorage.getItem('idPersona');

            if (token && role && id) {//
                setIsAuthenticated(true);
                setUserRole(role);
                setUserId(id); // ← AÑADIR
            }
        } catch (error) {

            console.error('Error verificando autenticación:', error);
            // En caso de error, limpiamos los estados
            setIsAuthenticated(false);
            setUserRole(null);
            setUserId(null);

        } finally {
            // // Retrasamos ligeramente el cambio de estado de loading
            // setTimeout(() => {
            setLoading(false);
            // }, 100);
        }
    };


    const login = async (role, idPersona) => {//token,
        try {
            // Guardamos todos los datos en AsyncStorage
            await Promise.all([
                // AsyncStorage.setItem('sessionToken', token),
                AsyncStorage.setItem('rol', role),
                AsyncStorage.setItem('idPersona', idPersona.toString())
            ]);

            setIsAuthenticated(true);
            setUserRole(role);
            setUserId(idPersona);
        } catch (error) {
            console.error('Error guardando token:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Removemos todos los datos de AsyncStorage
            await Promise.all([
                AsyncStorage.removeItem('userToken'),
                // AsyncStorage.removeItem('sessionToken'),
                AsyncStorage.removeItem('rol'),
                AsyncStorage.removeItem('idPersona')
            ]);
            
            setIsAuthenticated(false);
            setUserRole(null);
            setUserId(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw error;
        }
    };

    const value = {
        isAuthenticated,
        userRole,
        loading,
        login,
        logout,
        userId
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);