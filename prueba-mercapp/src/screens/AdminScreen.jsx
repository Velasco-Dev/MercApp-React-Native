import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Platform, KeyboardAvoidingView
} from 'react-native';

import CustomAlert from '../components/common/CustomAlert';

import { useUsuarios } from '../services/hooks/administrador.hooks';

import { theme } from '../components/themes/Theme';
import { COLORS } from '../components/themes/Colors';

import { MaterialIcons } from '@expo/vector-icons';
export default function AdminScreen() {

  // "correo": "jose@gmail.com",
  // "password": "12345678"

  const [selectedUser, setSelectedUser] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado

  const [alertStatus, setAlertStatus] = useState('loading'); // 'loading' | 'success' | 'error'

  const [alertTitle, setAlertTitle] = useState('');

  useEffect(() => {
    setAlertTitle('Usuario');
  }, []);

  const {
    usuarios,
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

  // Agrega este useEffect
  useEffect(() => {
    if (selectedUser) {
      setUserForm(prev => ({
        ...prev,
        ...selectedUser,
        edad: String(selectedUser.edad),
        identificacion: String(selectedUser.identificacion)
      }));
    }
  }, [selectedUser]); // Solo se ejecuta cuando selectedUser cambia

  // 2. Convertir el formato de API a un array plano de usuarios
  const usuariosPlano = React.useMemo(() => {
    // Verificar si existen los datos y si son un array
    if (!usuarios?.data || !Array.isArray(usuarios.data)) {
      console.error('Estructura de datos inválida:', usuarios);
      return [];
    }

    // Los usuarios ya están en data, no necesitan mapeo adicional
    return usuarios.data.map(usuario => ({
      ...usuario // Cada usuario es un objeto directo en el array
    }));
  }, [usuarios]);

  const handleSubmit = async () => {

    try {

      setAlertStatus('loading');
      setAlertVisible(true);

      // Validaciones comunes
      if (!userForm.nombrePersona || !userForm.apellido || !userForm.identificacion) {
        throw new Error('Complete todos los campos requeridos');
      }

      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userForm.correo)) {
        throw new Error('Correo electrónico inválido');
      }

      const userData = {
        ...userForm,
        edad: Number(userForm.edad),
        identificacion: Number(userForm.identificacion)
      };

      const success = isEditing
        ? await updateUser(selectedUser.idPersona, userData)
        : await addUser(userForm);

      if (success) {

        setAlertStatus('success');
        setAlertMessage(isEditing ? 'Actualizado exitosamente' : 'Creado exitosamente');
        resetForm();

        await fetchUsers();

      } else {
        setAlertStatus('error');
        setAlertMessage('Error al actualizar el usuario');
      }
    } catch (error) {

      setAlertStatus('error');
      setAlertMessage(error.message);

    } finally {
      setIsSubmitting(false);
    }

  };

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

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, theme.container]}>
        <Text style={styles.title}>Panel de Administración</Text>

        {/* Formulario de usuario */}
        <View style={theme.form}>
          <Text style={theme.subtitle}>
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
                onChangeText={(text) => {
                  // Validar que solo se ingresen números
                  const numeric = text.replace(/[^0-9]/g, '');
                  setUserForm({ ...userForm, edad: numeric })
                }}
                keyboardType="numeric"
              />
            </View>

            <View style={theme.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Identificación"
                value={userForm.identificacion}
                onChangeText={(text) => {
                  // Validar que solo se ingresen números
                  const numeric = text.replace(/[^0-9]/g, '');
                  setUserForm({ ...userForm, identificacion: numeric })
                }}
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
                onPress={handleSubmit}
                disabled={loading || isSubmitting}
              >
                <Text style={theme.button.textPrimary}>
                  {isEditing ? 'Actualizar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Lista de usuarios */}
        <View style={styles.listContainer}>
          <Text style={theme.subtitle}>Usuarios Registrados ({usuariosPlano?.length || 0})</Text>
          <FlatList
            data={usuariosPlano}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item.idPersona}// || Math.random().toString()
            ListEmptyComponent={() => (
              <View style={theme.emptyContainer}>
                <Text style={theme.emptyText}>
                  {loading ? 'Cargando...' : 'No hay usuarios registrados'}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.nombrePersona} {item.apellido}</Text>
                  <Text style={styles.userEmail}>Usuario: {item.correo}</Text>
                  <Text style={styles.userEmail}>Identificación: {item.identificacion}</Text>
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
          status={alertStatus}
          title={alertTitle}
          message={alertMessage}
          onClose={() => {
            if (alertStatus !== 'loading') {
              setAlertVisible(false);
              resetForm();
            } // Solo resetear si no está cargando
          }}
        />
      </View >
    </KeyboardAvoidingView>
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
