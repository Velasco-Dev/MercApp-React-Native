import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import MicroScreen from '../screens/MicroScreen';
import VendedorScreen from '../screens/VendedorScreen';
import RegistroScreen from '../screens/RegistroScreen';

import BackButton from '../components/common/BackButton';
import LogoutButton from '../components/common/LogoutButton';

import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const authScreenOptions = {
    headerLeft: () => <BackButton />,
    headerRight: null,
    headerStyle: {
        elevation: 10,
        shadowOpacity: 10,
        backgroundColor: '#fff',
    },
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    headerTintColor: '#000',
    headerTitleAlign: 'center',
};

const authenticatedScreenOptions = {
    headerLeft: null,
    headerRight: () => <LogoutButton />,
    headerStyle: {
        elevation: 10,
        shadowOpacity: 10,
        backgroundColor: '#fff',
    },
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    headerTintColor: '#000',
    headerTitleAlign: 'center',
};
export default function AppNavigator() {

    const { isAuthenticated, userRole, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const getInitialRouteName = () => {
        if (!isAuthenticated) return 'Login';
        switch (userRole) {
            case 'administrador': return 'Admin';
            case 'microempresario': return 'Micro';
            case 'vendedor': return 'Vendor';
            default: return 'Login';
        }
    };

    return (
        <Stack.Navigator initialRouteName={getInitialRouteName()}>
            {!isAuthenticated ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'MercApp - Inicio de Sesión', headerShown: false}} />
                    <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: 'Regístrate', }} />
                </>
            ) : (
                <>
                    {userRole === 'administrador' && <Stack.Screen name='Admin' component={AdminScreen} options={{ title: 'Administrador@',  headerRight: () => <LogoutButton />}} />}
                    {userRole === 'microempresario' && <Stack.Screen name='Micro' component={MicroScreen} options={{ title: 'Microempresari@',  headerRight: () => <LogoutButton /> }} />}
                    {userRole === 'vendedor' && <Stack.Screen name='Vendor' component={VendedorScreen} options={{ title: 'Vendedor@',  headerRight: () => <LogoutButton /> }} />}
                    {userRole === 'usuario' && <Stack.Screen name='Vendor' component={VendedorScreen} options={{ title: 'Vendedor@',  headerRight: () => <LogoutButton /> }} />}
                </>
            )}
        </Stack.Navigator>
    );
}