import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../components/themes/Theme';


export default function PaymentWaitingScreen() {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simula un delay mientras se prepara/redirige
    const timer = setTimeout(() => {
      // Aquí podrías abrir navegador externo o redirigir internamente
      // Ejemplo: Linking.openURL(pasarelaUrl);
      // O ir a una pantalla de resultado ficticia mientras pruebas
      navigation.navigate('Vendor');

    }, 10000);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient style={[styles.container, theme.container]} colors={['#4c669f', '#764ba2']}>
      <View style={[theme.card, styles.card]}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image
            source={require('../../../assets/icon.png')} // ajusta la ruta según tu estructura
            style={theme.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <ActivityIndicator color={theme.Colors.PRIMARY} size={"large"} />
        <Text style={styles.message}>
          Redirigiendo a la pasarela de pago
        </Text>
        <Text style={styles.submessage}>
          Por favor espera mientras procesamos tu pago
        </Text>
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 Conexión segura - Tus datos están protegidos
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "linear-gradient(135deg, , )",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  card:{
    padding: 20
  },
  loader: {
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: theme.Colors.TEXT,
    marginBottom: 5,
  },
  submessage: {
    fontSize: 14,
    color: theme.Colors.GRIS,
  },
  securityNote: {
    marginTop: 30,
    backgroundColor: "#dff0ff",
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#667eea",
    borderRadius: 10,
  },
  securityText: {
    color: theme.Colors.TEXT,
    fontSize: 12,
  },
});
