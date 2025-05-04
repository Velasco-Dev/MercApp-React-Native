import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { initialProducts } from '../data/data.jsx';
export default function MicroScreen() {

  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: ''
  });

  const [filter, setFilter] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      return;
    }

    const product = {
      id: `p${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      microId: 'u2' // ID del microempresario actual
    };

    initialProducts.push(product); // Actualizamos el array estático
    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', quantity: '' });
  };

  const updateQty = (id, change) => {
    setProducts(products.map(p => p.id === id ? { ...p, quantity: p.quantity + change } : p));
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Inventario</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Nombre del producto"
          value={newProduct.name}
          onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Precio"
          value={newProduct.price}
          onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Cantidad"
          value={newProduct.quantity}
          onChangeText={(text) => setNewProduct({ ...newProduct, quantity: text })}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Agregar Producto" onPress={addProduct} />
      </View>

      <TextInput placeholder="Buscar producto" value={filter} onChangeText={setFilter} style={styles.input} />

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name}</Text>
            <Text>Precio: ${item.price}</Text>
            <Text>Stock: {item.quantity}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title="+" onPress={() => updateQty(item.id, 1)} />
              <Button title="-" onPress={() => updateQty(item.id, -1)} />
            </View>
          </View>
        )}
      />

    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', padding: 10, 
    borderBottomWidth: 1 },
  form: { margin: 20, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    padding: 20, 
    borderRadius: 5 },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  }

});
