import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { initialUsers } from '../data/data.jsx';
import CustomAlert from '../components/common/CustomAlert.jsx';
export default function AdminScreen() {

  const [users, setUsers] = useState(initialUsers);
  const [newName, setNewName] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setAlertVisible(true);
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setAlertVisible(false);
  };

  const addUser = () => {
    if (!newName.trim()) return;
    const next = { id: `u${Date.now()}`, role: 'micro', name: newName.trim() };
    setUsers([...users, next]);
    setNewName('');
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios Registrados</Text>
      <FlatList
        data={users}
        keyExtractor={u => u.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name} [{item.role}]</Text>
            <TouchableOpacity onPress={() => handleDeleteUser(item)}>
              <Text style={{ color: 'red' }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput placeholder="Nuevo microempresario" value={newName} onChangeText={setNewName} style={styles.input} />
      <Button title="Agregar" onPress={addUser} />
      <CustomAlert
        visible={alertVisible}
        title="Confirmar eliminación"
        message="¿Está seguro que desea eliminar este usuario?"
        onClose={() => {
          setAlertVisible(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        showConfirm={true}
      />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, title: { fontSize: 18, marginBottom: 10 }, row: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 }, input: { borderWidth: 1, padding: 8, marginVertical: 10 } });
