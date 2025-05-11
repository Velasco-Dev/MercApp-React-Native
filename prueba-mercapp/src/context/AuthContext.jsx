import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // const [userId, setUserId] = useState(null);


    // Verificar token al iniciar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const role = await AsyncStorage.getItem('userRole');
            // const id = await AsyncStorage.getItem('userId');

            if (token && role ) {//&& id
                setIsAuthenticated(true);
                setUserRole(role);
                // setUserId(id); // ← AÑADIR
            }
        } catch (error) {

            console.error('Error verificando autenticación:', error);

        } finally {
            // // Retrasamos ligeramente el cambio de estado de loading
            // setTimeout(() => {
                setLoading(false);
            // }, 100);
        }
    };


    const login = async (token, role, idPersona) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', role);
            // await AsyncStorage.getItem('userId', idPersona);

            setIsAuthenticated(true);
            setUserRole(role);
        } catch (error) {
            console.error('Error guardando token:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userRole');
            setIsAuthenticated(false);
            setUserRole(null);
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
        // userId
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);