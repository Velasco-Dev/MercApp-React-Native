import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, Linking, View, Image } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import MicroScreen from '../screens/MicroScreen';
import RegistroScreen from '../screens/RegistroScreen';

import VendedorScreen from '../screens/VendedorScreen';
import PaymentWaitingScreen from '../screens/payment/PaymentWaitingScreen';
import PaymentResponseScreen from '../screens/payment/PaymentResponseScreen';

import HomeScreen from '../screens/HomeScreen';

import BackButton from '../components/common/BackButton';
import LogoutButton from '../components/common/LogoutButton';
import NotifyButton from '../components/common/NotifyButton';

import { useAuth } from '../context/AuthContext';
import { theme } from '../components/themes/Theme';

import { useNavigation } from '@react-navigation/native';

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

const ScreenOptions = {
    headerStyle: {
        elevation: 10,
        shadowOpacity: 10,
        backgroundColor: theme.Colors.BLANCO,
    },
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    headerTintColor: '#000',
    headerTitleAlign: 'center',
    headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
            <NotifyButton />
            <LogoutButton /> {/* Si también necesitas el botón de logout */}
        </View>
    ),
    headerTitle: () => (
        <Image
            source={require('../../assets/icon.png')}
            style={{ width: 120, height: 40, resizeMode: 'contain' }}
        />
    ),
};
export default function AppNavigator() {

    const { isAuthenticated, userRole, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.Colors.PRIMARY} />
            </View>
        );
    }

    const getInitialRouteName = () => {
        if (!isAuthenticated) return 'Login';
        switch (userRole) {
            case 'administrador': return 'Admin';
            case 'microempresario': return 'Micro';
            case 'vendedor': return 'Vendor';
            case 'usuario': return 'Home';
            default: return 'Login';
        }
    };

    const navigation = useNavigation();

    useEffect(() => {
        const handleDeepLink = ({ url }) => {
            const parsed = new URL(url);
            const status = parsed.searchParams.get("status");
            const paymentId = parsed.searchParams.get("payment_id");
            const preferenceId = parsed.searchParams.get("preference_id");

            console.log("Pago recibido:", { status, paymentId, preferenceId });

            if (!status) return; // Evita navegación con datos incompletos

            // Redirige dentro de tu app según estado
            navigation.navigate("PaymentResponse", {
                paymentId,
                preferenceId,
                status,
            });
        };

        const subscription = Linking.addEventListener("url", handleDeepLink);

        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink({ url });
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            });
        }
    }, [isAuthenticated]);


    return (
        <Stack.Navigator initialRouteName={getInitialRouteName()}
            screenOptions={{
                ...ScreenOptions,
                cardStyle: { flex: 1 }, // ¡Esto es crucial!
            }}>
            {!isAuthenticated ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'MercApp - Inicio de Sesión', headerShown: false }} />
                    <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: 'Regístrate', headerRight: false }} />
                </>
            ) : (
                <>
                    {userRole === 'administrador' && <Stack.Screen name='Admin' component={AdminScreen} options={{ title: 'MercApp - Administrador', headerLeft: false }} />}
                    {userRole === 'microempresario' && <Stack.Screen name='Micro' component={MicroScreen} options={{ title: 'MercApp - Microempresario', headerLeft: false }} />}
                    {userRole === 'usuario' && <Stack.Screen name='Home' component={HomeScreen} options={{ title: 'MercApp - Inicio', headerLeft: false }} />}

                    {userRole === 'vendedor' && <Stack.Screen name='Vendor' component={VendedorScreen} options={{ title: 'MercApp - Vendedor', headerLeft: false }} />}
                    {userRole === 'vendedor' &&
                        <Stack.Screen
                            name='PaymentWaiting'
                            component={PaymentWaitingScreen}
                            options={{
                                title: 'MercApp - Procesando Pago',
                                gestureEnabled: false, headerShown: false
                            }}
                        />}
                    {userRole === 'vendedor' &&
                        <Stack.Screen
                            name='PaymentResponse'
                            component={PaymentResponseScreen}
                            options={{
                                title: 'MercApp - Pago',
                                headerShown: false
                            }}
                        />}
                </>
            )}
        </Stack.Navigator>
    );
}