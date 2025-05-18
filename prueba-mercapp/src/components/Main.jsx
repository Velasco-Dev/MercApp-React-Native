import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

import { AuthProvider } from '../context/AuthContext';

const Main = () => {
    return (
        <View style={{ flex: 1 }}>
            <AuthProvider>
                <NavigationContainer>
                    <AppNavigator />
                </NavigationContainer>
            </AuthProvider>
        </View>
    );
}

export default Main;