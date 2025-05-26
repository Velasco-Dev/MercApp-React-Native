import React, { useEffect, useState } from 'react';

import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../themes/Theme';

import { useNotification } from '../../context/NotificationContext';

// Componente del botón de notificaciones
const NotifyButton = () => {

  const { showModal } = useNotification();

  return (
    <View>
      <TouchableOpacity
        style={style.headerButton}
        onPress={showModal}
      >
        <Ionicons name="notifications" size={24} color={theme.Colors.ACCENT} />
        {/* Opcional: Badge para contar notificaciones */}
        <View style={style.notification}>
          <Text style={style.text}>•</Text>
        </View>
      </TouchableOpacity>
    </View>

  );
};
const style = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 10
  },
  headerButton: {
    margin: 15,
    paddingVertical: 8,
  },
});

export default NotifyButton;