import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider, useNotification } from "../context/NotificationContext";

import NotificationModal from "./common/modals/NotificationModal";

const Main = () => {

    const { visible, notifications, hideModal } = useNotification();

    return (
        <View style={{ flex: 1 }}>
            <AuthProvider>
                <NavigationContainer>
                    <AppNavigator />
                    <NotificationModal
                        visible={visible}
                        notifications={notifications}
                        onClose={hideModal}
                    />
                </NavigationContainer>
            </AuthProvider>
        </View>
    );
}

export default Main;