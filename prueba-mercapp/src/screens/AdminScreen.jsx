import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Platform, KeyboardAvoidingView, Dimensions
} from 'react-native';

import CustomAlert from '../components/common/CustomAlert';

import { useUsuarios } from '../services/hooks/administrador.hooks';

import { theme } from '../components/themes/Theme';
import { COLORS } from '../components/themes/Colors';

import { MaterialIcons } from '@expo/vector-icons';

import { useNotification } from '../context/NotificationContext';

import { ref, onValue, set, push, getDatabase, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';

import DropDownPicker from 'react-native-dropdown-picker';
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

  const { addNotification } = useNotification();

  const [notificaciones, setNotificaciones] = useState([]); // Estado para la lista de notificaciones
  const db = getDatabase();

  useEffect(() => {
    setAlertTitle('Usuario');
    // Ejecutar solo al montar el componente
    addNotification({
      message: "Bienvenido Administrador",
    });
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

  const [filter, setFilter] = useState('');

  const filtered = usuariosPlano.filter(p =>
    p.nombrePersona.toLowerCase().includes(filter.toLowerCase()) ||
    p.apellido.toLowerCase().includes(filter.toLowerCase()) ||
    p.idPersona.toLowerCase().includes(filter.toLowerCase())
  );

  const [idUsuarioNotificacion, setIdUsuarioNotificacion] = useState(null);
  const [rolUsuarioNotificacion, setRolUsuarioNotificacion] = useState(null);

  useEffect(() => {
    // 1. Crea una referencia a la lista
    const notificacionesRef = ref(db, 'notificaciones-rol');

    // 2. Configura los listeners de hijo

    // Listener para cuando se añade un nuevo hijo (o un hijo ya existente al inicio)
    const onChildAddedListener = onChildAdded(notificacionesRef, (snapshot) => {
      const nuevaNotificacion = {
        id: snapshot.key, // Obtiene la clave única generada por push()
        ...snapshot.val() // Obtiene los datos de la notificación
      };
      console.log("Nueva notificación añadida:", nuevaNotificacion);
      setIdUsuarioNotificacion(nuevaNotificacion.userId);
      // Añade la nueva notificación al estado. Ojo: la forma de añadir puede depender de cómo quieras ordenarla.
      // Aquí simplemente la añadimos al final:
      addNotification({
        message: `El usuario ${nuevaNotificacion.userId}, ha solicitado cambio de rol a ${nuevaNotificacion.rol}`
      });

      setNotificaciones(prevNotificaciones => [...prevNotificaciones, nuevaNotificacion]);
    });

    // Listener para cuando un hijo existente cambia
    const onChildChangedListener = onChildChanged(notificacionesRef, (snapshot) => {
      const notificacionActualizada = {
        id: snapshot.key,
        ...snapshot.val()
      };
      console.log("Notificación actualizada:", notificacionActualizada);
      // Actualiza la notificación en el estado
      setNotificaciones(prevNotificaciones =>
        prevNotificaciones.map(notif =>
          notif.id === notificacionActualizada.id ? notificacionActualizada : notif
        )
      );
    });

    // Listener para cuando un hijo es eliminado
    const onChildRemovedListener = onChildRemoved(notificacionesRef, (snapshot) => {
      const notificacionEliminadaKey = snapshot.key;
      console.log("Notificación eliminada con clave:", notificacionEliminadaKey);
      // Elimina la notificación del estado
      setNotificaciones(prevNotificaciones =>
        prevNotificaciones.filter(notif => notif.id !== notificacionEliminadaKey)
      );
    });

    // 3. Limpia los listeners al desmontar el componente
    return () => {
      console.log("Desuscribiendo listeners de notificaciones-rol");
      onChildAddedListener(); // Llama a la función devuelta por onChildAdded para detener la escucha
      onChildChangedListener(); // Llama a la función devuelta por onChildChanged
      onChildRemovedListener(); // Llama a la función devuelta por onChildRemoved
      // Si usas onChildMoved, también debes limpiarlo aquí
    };
  }, []); // El array vacío [] asegura que este efecto solo se ejecute al montar/desmontar

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

        if (isEditing && selectedUser?.idPersona === idUsuarioNotificacion) {          // Añadir un nuevo elemento a una lista (push genera una clave única)
          const postsRef = ref(db, 'notificaciones-rol-respuesta');
          const nuevaRespuestaRef = push(postsRef); // Genera una nueva clave única en /posts
          const timestamp = new Date().toLocaleString('es-CO');

          set(nuevaRespuestaRef, {
            titulo: 'Su solicitud fue aceptada',
            rol: selectedUser.rol,
            userId: selectedUser.idPersona,
            timestamp: timestamp // Usa el tiempo del servidor
          })
            .then(() => {

              console.log('Nuevo post añadido con clave (notificaciones-rol-respuesta):', nuevaRespuestaRef.key);

            }).catch((error) => {

              console.error('Error al añadir post (notificaciones-rol-respuesta):', error);

            });
        }

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

  // Dentro del componente, antes del return
  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth > 1080 ? 5 : screenWidth <= 500 ? 2 : 4;

  useEffect(() => {
    setValue(userForm.rol || '');
  }, [userForm.rol]);


  const roles = [
    { id: 1, label: 'Administrador', value: 'administrador' },
    { id: 2, label: 'Microempresario', value: 'microempresario' },
    { id: 3, label: 'Vendedor', value: 'vendedor' },
    { id: 4, label: 'Usuario', value: 'usuario' },
  ];

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(userForm.rol || '');
  const [items, setItems] = useState(
    roles.map(cat => ({ label: cat.label, value: cat.value }))
  );



  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, theme.container]}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>Panel de Administración</Text>
          <TouchableOpacity
            style={[theme.button.primary]}
            onPress={() => addToCart()}
          >
            <MaterialIcons name="add" size={24} color={COLORS.BLANCO} />
            {/* <Text style={[theme.Colors.BLANCO]}>Listar Productos</Text> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[theme.button.secondary]}
            onPress={() => addToCart()}
          >
            <MaterialIcons name="add" size={24} color={COLORS.BLANCO} />
          </TouchableOpacity>
        </View>

        {/* Formulario de usuario */}
        <View style={[theme.form, { zIndex: 1000 }]}>
          <Text style={theme.subtitle}>
            {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
          </Text>

          <View style={theme.formRow}>
            <View style={theme.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={userForm.nombrePersona}
                onChangeText={(text) => {

                  const capitalizedText = text
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  setUserForm({ ...userForm, nombrePersona: capitalizedText });
                }}
              />
            </View>

            <View style={theme.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={userForm.apellido}
                onChangeText={(text) => {

                  const capitalizedText = text
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                  setUserForm({ ...userForm, apellido: capitalizedText });
                }}
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

          {isEditing ? (
            <>
              <View style={theme.formRow}>
                <View style={theme.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Correo"
                    value={userForm.correo}
                    onChangeText={(text) => {
                      const correoNormalizado = String(text).toLowerCase().trim();
                      setUserForm({ ...userForm, correo: correoNormalizado });
                    }}
                    keyboardType="email-address"
                  />
                </View>
                <View style={theme.inputContainer}>
                  {/* <TextInput
                    style={styles.input}
                    placeholder="Rol"
                    value={userForm.rol}
                    onChangeText={(text) => setUserForm({ ...userForm, rol: text })}
                    keyboardType="default"
                  /> */}
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={(callback) => {
                      setValue(callback);
                      setUserForm((prevForm) => ({
                        ...prevForm,
                        rol: typeof callback === 'function' ? callback(prevForm.rol) : callback,
                      }));
                    }}
                    setItems={setItems}
                    placeholder="Seleccione un rol"
                    style={theme.picker}
                  />
                </View>
              </View>
              <View style={[theme.formEditRow, { zIndex: -1 }]}>
                <View style={[theme.inputContainer]}>
                  <TouchableOpacity
                    style={theme.button.primary}
                    onPress={handleSubmit}
                    disabled={loading || isSubmitting}
                  >
                    <Text style={theme.button.textPrimary}>
                      Actualizar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <>
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
                <View style={[theme.inputContainer, { zIndex: -1 }]}>
                  <TouchableOpacity
                    style={theme.button.primary}
                    onPress={handleSubmit}
                    disabled={loading || isSubmitting}
                  >
                    <Text style={theme.button.textPrimary}>
                      Crear
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Lista de usuarios */}
        <View style={styles.listContainer}>
          <TextInput placeholder="Buscar usuario" value={filter} onChangeText={setFilter} style={[theme.inputFilter]} />
          <Text style={theme.subtitle}>Usuarios Registrados ({usuariosPlano?.length || 0})</Text>
          <FlatList
            data={filtered}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item.idPersona}// || Math.random().toString()
            numColumns={numColumns} // Añade esta línea para mostrar 2 columnas
            columnWrapperStyle={theme.row} // Añade esta línea para el estilo de las filas
            ListEmptyComponent={() => (
              <View style={theme.emptyContainer}>
                <Text style={theme.emptyText}>
                  {loading ? 'Cargando...' : 'No hay usuarios registrados'}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={theme.card}>
                <View style={[theme.card.header]}>
                  <Text style={[theme.name, { color: theme.Colors.BLANCO }]}>
                    {item.nombrePersona} {item.apellido}
                  </Text>
                </View>
                <View style={{ margin: 10 }}>
                  <Text style={theme.info}>Usuario: {item.correo}</Text>
                  <Text style={theme.info}>Identificación: {item.identificacion}</Text>
                  <Text style={[theme.info, { color: theme.Colors.ACCENT }]}>Rol: {item.rol}</Text>
                  <View style={theme.card.buttonCardContainer}>
                    <TouchableOpacity
                      style={[theme.button.editar, styles.actionButton]}
                      onPress={() => {
                        setSelectedUser(item);
                        setUserForm(item);
                        setIsEditing(true);
                      }}
                    >
                      <View style={theme.button.buttonContent}>
                        <MaterialIcons
                          name="edit"
                          size={24}
                          color={COLORS.BLANCO}
                          style={theme.button.icon}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
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
    padding: 10,
    paddingTop: 0
  },
  list: {
    flex: 1
  },
  listContent: {
    paddingBottom: 10
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
    // padding: 10,
    backgroundColor: COLORS.BACKGROUND
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
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
