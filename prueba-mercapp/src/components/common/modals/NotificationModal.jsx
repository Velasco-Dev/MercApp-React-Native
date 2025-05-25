import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../themes/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useNotification } from '../../../context/NotificationContext'; // ✅ Importa el contexto


const NotificationModal = ({ visible, onClose }) => {

  const { notifications, removeNotification, clearNotifications } = useNotification(); // ✅ Destructura lo necesario

  return (
    <Modal visible={visible}
      animationType="fade"
      transparent>

      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modal}>
          <Text style={styles.title}>Notificaciones</Text>

          <FlatList
            data={notifications}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.message}</Text>
                <TouchableOpacity onPress={() => removeNotification(item.id)}>
                  <Ionicons name="close-circle" size={20} color={theme.Colors.ERROR} />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Sin notificaciones</Text>}
          />

          {notifications.length > 0 && (
            <TouchableOpacity
              style={[{ alignSelf: 'center', marginTop: 10}]}
              onPress={clearNotifications}
            >
              <Text style={styles.closeButtonText}>Borrar todas</Text>
            </TouchableOpacity>
          )}

        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 64,
    paddingRight: '5%',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '40%',
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  notificationItem: {
    paddingVertical: 6,
    marginVertical: 2,
    backgroundColor: theme.Colors.BACKGROUND,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: theme.Colors.GRIS,
    borderStartWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  notificationText: {
    fontSize: 14,
    color: theme.Colors.TEXT,
    marginInline: 20,
  },
  empty: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginVertical: 10
  },
  closeButtonText: {
    color: theme.Colors.TEXT,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default NotificationModal;
