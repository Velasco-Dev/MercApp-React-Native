import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Platform, ScrollView, ActivityIndicator
} from 'react-native';

import CustomAlert from '../components/common/CustomAlert';

import { useUsuarios } from '../services/hooks/administrador.hooks';

import { theme } from '../components/themes/Theme';
import { COLORS } from '../components/themes/Colors';

import { MaterialIcons } from '@expo/vector-icons';
export default function AdminScreen() {

  // "correo": "jose.jose@ejemplo.com",
  // "password": "admin123"

  const [selectedUser, setSelectedUser] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser
  } = useUsuarios();

  const [userForm, setUserForm] = useState({
    idPersona: '',
    nombrePersona: '',
    apellido: '',
    edad: '',
    identificacion: '',
    correo: '',
    rol: 'usuario'
  });

  const resetForm = () => {
    setUserForm({
      idPersona: '',
      nombrePersona: '',
      apellido: '',
      edad: '',
      identificacion: '',
      correo: '',
      rol: 'usuario'
    });
    setSelectedUser(null);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    const success = isEditing
      ? await updateUser(userForm.idPersona, userForm)
      : await addUser(userForm);

    if (success) {
      setAlertMessage(isEditing ? 'Usuario actualizado' : 'Usuario creado');
      resetForm();
    } else {
      setAlertMessage('Error en la operación');
    }
    setAlertVisible(true);
  };

  const handleCreateUser = async () => {
    try {
      const success = await addUser(userForm);
      if (success) {
        setAlertMessage('Usuario creado exitosamente');
        resetForm();
      } else {
        setAlertMessage('Error al crear usuario');
      }
    } catch (err) {
      setAlertMessage(err.message);
    }
    setAlertVisible(true);
  };

  // Renderizado condicional para loading y error
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={theme.button.primary}
          onPress={fetchUsers}
        >
          <Text style={theme.button.textPrimary}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administración</Text>

      {/* Formulario de usuario */}
      <View style={theme.form}>
        <Text style={styles.subtitle}>
          {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
        </Text>

        <View style={theme.formRow}>
          <View style={theme.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={userForm.nombrePersona}
              onChangeText={(text) => setUserForm({ ...userForm, nombrePersona: text })}
            />
          </View>

          <View style={theme.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={userForm.apellido}
              onChangeText={(text) => setUserForm({ ...userForm, apellido: text })}
            />
          </View>
        </View>

        <View style={theme.formRow}>
          <View style={theme.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Edad"
              value={userForm.edad}
              onChangeText={(text) => setUserForm({ ...userForm, edad: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={theme.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Identificación"
              value={userForm.identificacion}
              onChangeText={(text) => setUserForm({ ...userForm, identificacion: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={theme.formRow}>
          <View style={theme.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo"
              value={userForm.correo}
              onChangeText={(text) => setUserForm({ ...userForm, correo: text })}
              keyboardType="email-address"
            />
          </View>

          <View style={theme.inputContainer}>
            <TouchableOpacity
              style={theme.button.primary}
              onPress={isEditing ? () => handleSubmit(selectedUser.idPersona) : handleCreateUser}
            >
              <Text style={theme.button.textPrimary}>
                {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Lista de usuarios */}
      <View style={styles.listContainer}>
        <Text style={styles.subtitle}>Usuarios Registrados ({users?.length || 0})</Text>
        <FlatList
          data={users || []}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.idPersona?.toString() || Math.random().toString()}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {loading ? 'Cargando...' : 'No hay usuarios registrados'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.nombrePersona} {item.apellido}</Text>
                <Text style={styles.userEmail}>{item.correo}</Text>
                <Text style={styles.userRole}>Rol: {item.rol}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[theme.button.editar, styles.actionButton]}
                  onPress={() => {
                    setSelectedUser(item);
                    setUserForm(item);
                    setIsEditing(true);
                  }}
                >
                  <MaterialIcons name="edit" size={24} color={COLORS.BLANCO} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0
  },
  list: {
    flex: 1
  },
  listContent: {
    paddingBottom: 20
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center'
  },
  emptyText: {
    color: COLORS.SECONDARY,
    fontSize: 16
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.BACKGROUND
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.TEXT
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: COLORS.TEXT
  },
  form: {
    alignSelf: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        width: '70%', // Más pequeño en web
        // maxWidth: 400, // Tamaño máximo para pantallas grandes
        // minWidth: 300, // Tamaño mínimo para que sea usable
      },
      default: {
        width: '100%', // Mantiene el 100% en móvil
      }
    }),
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 2,
    padding: 10,
    backgroundColor: COLORS.BLANCO,
    // Reemplaza boxShadow (que no funciona en React Native) por:
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
      default: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: COLORS.BACKGROUND
  },
  userCard: {
    backgroundColor: COLORS.BLANCO,
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'auto',
    // Sombras
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      },
    })
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  userEmail: {
    color: COLORS.SECONDARY
  },
  userRole: {
    color: COLORS.ACCENT
  },
  actionButtons: {
    flexDirection: 'row'
  },
  actionButton: {
    padding: 8,
    marginLeft: 5
  }
});
