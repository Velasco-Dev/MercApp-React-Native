import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

import { AuthProvider } from '../context/AuthContext';

const Main = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator/>
            </NavigationContainer>
        </AuthProvider>
    );
}

export default Main;