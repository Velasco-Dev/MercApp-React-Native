import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

import { AuthProvider } from '../context/AuthContext';

const Main = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#111fff'
    },
    text: {
        color: '#fff',
    },
});

export default Main;