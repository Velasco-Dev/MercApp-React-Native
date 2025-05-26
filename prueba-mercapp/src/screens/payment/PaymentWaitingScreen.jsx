import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, Animated, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../components/themes/Theme';


export default function PaymentWaitingScreen({ route }) {
  const navigation = useNavigation();
  const { url } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!url) return;

    console.log("Abriendo URL de pago:", url);

    setTimeout(async () => {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        Linking.openURL(url);
      } else {
        console.error("No se puede abrir la URL:", url);
      }
    }, 2000);
  }, [url]);


  useEffect(() => {

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();

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
  card: {
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
