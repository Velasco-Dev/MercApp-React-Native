import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, Platform,
  TouchableOpacity, StyleSheet, Dimensions, ScrollView,
  KeyboardAvoidingView, ActivityIndicator
} from 'react-native';

import { theme } from '../components/themes/Theme';
import { COLORS } from '../components/themes/Colors';
import CustomAlert from '../components/common/CustomAlert';

import { MaterialIcons } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';

import { useProductos } from '../services/hooks/producto.hooks';

export default function MicroScreen() {

  // "correo": "ruben@gmail.com",
  // "password": "12345678"
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [filter, setFilter] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado

  const [alertStatus, setAlertStatus] = useState('loading'); // 'loading' | 'success' | 'error'

  useEffect(() => {
    setAlertTitle('Producto');
  }, []);

  const categorias = [
    'Seleccione una categoría',
    'Frutas',
    'Verduras',
    'Carnes',
    'Lácteos',
    'Bebidas',
    'Snacks',
    'Limpieza',
    'Otros'
  ];

  const {
    productos,
    loading,
    error,
    fetchProductos,
    addProducto,
    updateProducto
  } = useProductos();

  const [formData, setFormData] = useState({
    idProducto: '',
    nombre: '',
    cantidad: '',
    categoria: '',
    precio: '',
    estado: true,
    descuento: ''
  });

  const resetForm = () => {
    setFormData({
      idProducto: '',
      nombre: '',
      cantidad: '',
      categoria: '',
      precio: '',
      estado: true,
      descuento: ''
    });
    setSelectedProduct(null);
    setIsEditing(false);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        ...selectedProduct,
        cantidad: Number(selectedProduct.cantidad),
        precio: Number(selectedProduct.precio),
        descuento: Number(selectedProduct.descuento)
      }));
    }
  }, [selectedProduct]);

  // 2. Convertir el formato de API a un array plano de productos
  const productosPlano = React.useMemo(() => {
    if (!productos?.data?.categorias) return [];

    return productos.data.categorias.flatMap(categoria =>
      categoria.productos.map(producto => ({
        ...producto,
        categoria: categoria.nombreCategoria // Añadimos la categoría a cada producto
      }))
    );
  }, [productos]);

  const filtered = productosPlano.filter(p =>
    p.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    p.categoria.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSubmit = async () => {

    try {

      setAlertStatus('loading');
      setAlertVisible(true);

      // Validaciones
      if (!formData.nombre || !formData.cantidad || !formData.precio) {
        throw new Error('Por favor complete todos los campos requeridos');
      }

      const productoData = {
        ...formData,
        cantidad: Number(formData.cantidad),
        precio: Number(formData.precio),
        descuento: Number(formData.descuento)
      };

      const success = isEditing
        ? await updateProducto(selectedProduct.idProducto, productoData)
        : await addProducto(formData);

      if (success) {

        setAlertStatus('success');
        setAlertMessage(isEditing ? 'Actualizado exitosamente' : 'Creado exitosamente');
        resetForm();

        await fetchProductos();

      } else {
        setAlertStatus('error');
        setAlertMessage('Error al actualizar el producto');
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
          onPress={fetchProductos}
        >
          <Text style={theme.button.textPrimary}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Dentro del componente, antes del return
  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth >= 768 ? 5 : 3; // 3 columnas en pantallas grandes, 2 en pequeñas

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, theme.container]}>

        <Text style={[styles.title, theme.typography.h2]}>Registro de Producto</Text>

        <View style={styles.form}>

          <View style={styles.formRow}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="ID Producto"
                value={formData.idProducto}
                onChangeText={(text) => setFormData({ ...formData, idProducto: text })}
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nombre del Producto"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Cantidad"
                value={formData.cantidad}
                onChangeText={(text) => {
                  // Validar que solo se ingresen números
                  const numeric = text.replace(/[^0-9]/g, '');
                  // Actualizar el estado solo si es un número válido
                  setFormData({ ...formData, cantidad: numeric })
                }}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Precio"
                value={formData.precio}
                onChangeText={(text) => {
                  // Validar que solo se ingresen números
                  const numeric = text.replace(/[^0-9]/g, '');
                  // Actualizar el estado solo si es un número válido
                  setFormData({ ...formData, precio: numeric })
                }}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={formData.categoria}
                onValueChange={(itemValue) =>
                  setFormData({ ...formData, categoria: itemValue })
                }
                style={theme.picker}
              >
                {categorias.map((cat, index) => (
                  <Picker.Item
                    key={index}
                    label={cat}
                    value={index === 0 ? '' : cat}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Descuento"
                value={formData.descuento}
                onChangeText={(text) => {
                  // Validar que solo se ingresen números
                  const numeric = text.replace(/[^0-9]/g, '');
                  // Actualizar el estado solo si es un número válido
                  setFormData({ ...formData, descuento: numeric })
                }}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <TouchableOpacity
            style={theme.button.primary}
            onPress={handleSubmit}
            disabled={loading || isSubmitting}
          >
            <Text style={theme.button.textPrimary}>
              {isEditing ? 'Actualizar' : 'Crear'}
            </Text>
          </TouchableOpacity>

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
        </View>

        <TextInput placeholder="Buscar producto" value={filter} onChangeText={setFilter} style={styles.inputFilter} />
        <Text style={theme.subtitle}>Productos Registrados ({productosPlano?.length || 0})</Text>
        <ScrollView style={styles.container}>
          <FlatList
            data={filtered}
            keyExtractor={p => p.idProducto}
            numColumns={numColumns} // Añade esta línea para mostrar 2 columnas
            columnWrapperStyle={theme.row} // Añade esta línea para el estilo de las filas
            // style={theme.flatList}
            // contentContainerStyle={theme.flatListContent}
            ListEmptyComponent={() => (
              <View style={theme.emptyContainer}>
                <Text style={theme.emptyText}>
                  {loading ? 'Cargando...' : 'No hay productos registrados'}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View style={theme.card}>
                <Text style={theme.name}>{item.nombre}</Text>
                <Text style={theme.info}>Precio: ${item.precio}</Text>
                <Text style={theme.info}>Stock: {item.cantidad}</Text>
                <Text style={theme.info}>Categoría: {item.categoria}</Text>
                <Text style={theme.info}>Descuento: {item.descuento}%</Text>
                <View style={theme.card.buttonCardContainer}>
                  <TouchableOpacity
                    style={[theme.button.editar, theme.card.buttonCard]}
                    onPress={() => {
                      setFormData(item);
                      setIsEditing(true);
                      setSelectedProduct(item);
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
            )}
          />
        </ScrollView>

      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  inputContainer: {
    width: '48%', // Deja un pequeño espacio entre inputs
  },
  title: {
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', padding: 10,
    borderBottomWidth: 1
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
  container: {
    flex: 1,
    marginTop: 5,
    // paddingTop: 5,
    // paddingBottom: 10,
    backgroundColor: COLORS.BACKGROUND
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.BACKGROUND,
    color: COLORS.TEXT,
    width: '100%',
  },
  inputFilter: {
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
    borderRadius: 5,
    padding: 10,
    marginTop: 25,
    marginBottom: 5,
    backgroundColor: COLORS.BLANCO,
    color: COLORS.SECONDARY,
    width: '80%',
    alignSelf: 'center',
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
    }
  }

});
