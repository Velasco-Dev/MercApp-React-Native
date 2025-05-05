import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, Platform,
  TouchableOpacity, StyleSheet, Dimensions, ScrollView
} from 'react-native';

import { obtenerProductos, crearProducto } from '../services/producto/producto.service';
import { theme } from '../components/themes/Theme';
import { COLORS } from '../components/themes/Colors';
import CustomAlert from '../components/common/CustomAlert';

import { MaterialIcons } from '@expo/vector-icons';

import { Picker } from '@react-native-picker/picker';

export default function MicroScreen() {

  // "correo": "carlos.gomez@ejemplo.com",
  // "password": "123456"

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

  const [formData, setFormData] = useState({
    idProducto: '',
    nombre: '',
    cantidad: '',
    categoria: '',
    precio: '',
    estado: true,
    descuento: ''
  });

  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState([]);

  const filtered = products.filter(p =>
    p.nombre.toLowerCase().includes(filter.toLowerCase()) ||
    p.categoria.toLowerCase().includes(filter.toLowerCase())
  );

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await obtenerProductos();
        setProducts(data);
      } catch (error) {
        setAlertMessage('Error al cargar productos: ' + error.message);
        setAlertVisible(true);
      }
    };

    loadProducts();
  }, []);

  const addProduct = async () => {

    try {

      setLoading(true);
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

      const response = await crearProducto(productoData);

      // Después de crear el producto, actualiza la lista
      const updatedProducts = await obtenerProductos();
      setProducts(updatedProducts);

      setAlertMessage('Producto creado exitosamente');
      setAlertVisible(true);
      // Limpiar formulario
      setFormData({
        idProducto: '',
        nombre: '',
        cantidad: '',
        categoria: '',
        precio: '',
        estado: true,
        descuento: ''
      });

    } catch (error) {

      setAlertMessage(error.message);
      setAlertVisible(true);

    } finally {

      setLoading(false);

    }
  };

  // Dentro del componente, antes del return
  const screenWidth = Dimensions.get('window').width;
  const numColumns = screenWidth >= 768 ? 5 : 3; // 3 columnas en pantallas grandes, 2 en pequeñas

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Registro de Producto</Text>

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
          onPress={addProduct}
          disabled={loading}
        >
          <Text style={theme.button.textPrimary}>
            {loading ? 'Registrando...' : 'Registrar Producto'}
          </Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>

      <TextInput placeholder="Buscar producto" value={filter} onChangeText={setFilter} style={styles.inputFilter} />
      <ScrollView style={styles.container}>
        <FlatList
          data={filtered}
          keyExtractor={p => p.idProducto}
          numColumns={numColumns} // Añade esta línea para mostrar 2 columnas
          columnWrapperStyle={theme.row} // Añade esta línea para el estilo de las filas
          // style={theme.flatList}
          // contentContainerStyle={theme.flatListContent}
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
                  onPress={() => handleEdit(item.idProducto)}
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
    fontSize: theme.typography.h2,
    fontWeight: 'bold',
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
    padding: 20,
    backgroundColor: COLORS.BACKGROUND
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.TEXT
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
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: COLORS.BLANCO,
    color: COLORS.SECONDARY,
    width: '80%',
    alignSelf: 'center',
  }

});
