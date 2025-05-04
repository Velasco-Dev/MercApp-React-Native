import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Modal } from 'react-native';
import { initialProducts, initialSales } from '../data/data.jsx';

export default function VendorScreen() {

    const [products, setProducts] = useState(initialProducts);
    const [sales, setSales] = useState(initialSales);
    const [cart, setCart] = useState([]); // Nuevo estado para el carrito
    const [modalVisible, setModalVisible] = useState(false);

    // Calcular el total de ventas del día
    const todayTotalSales = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return sales
            .filter(sale => sale.date === today)
            .reduce((total, sale) => total + sale.total, 0);
    }, [sales]);

    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, qty: item.qty + quantity }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product.id,
                productName: product.name,
                qty: quantity,
                price: product.price
            }]);
        }
    };

    const subtractToCart = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.productId === product.id);

        if (existingItem) {
            // Si la cantidad es 0 o menor, removemos el item del carrito
            if (existingItem.qty <= quantity) {
                setCart(cart.filter(item => item.productId !== product.id));
            } else {
                // Si no, restamos la cantidad
                setCart(cart.map(item =>
                    item.productId === product.id
                        ? { ...item, qty: item.qty - quantity }
                        : item
                ));
            }
        }
    };

    const registerSale = () => {
        if (cart.length === 0) return;

        // Actualizar stock
        const updatedProducts = products.map(product => {
            const cartItem = cart.find(item => item.productId === product.id);
            if (cartItem) {
                return { ...product, quantity: product.quantity - cartItem.qty };
            }
            return product;
        });

        // Crear nueva venta
        const newSale = {
            id: `s${Date.now()}`,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
            date: new Date().toISOString().split('T')[0]
        };

        setProducts(updatedProducts);
        setSales([...sales, newSale]);
        setCart([]); // Limpiar carrito
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ventas Realizadas</Text>

            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total del día:</Text>
                <Text style={styles.totalAmount}>${todayTotalSales}</Text>
            </View>

            <Button title="Nueva Venta" onPress={() => setModalVisible(true)} />

            <FlatList
                data={sales}
                keyExtractor={sale => sale.id}
                renderItem={({ item }) => (
                    <View style={styles.saleItem}>
                        <Text style={styles.saleDate}>{item.date}</Text>
                        {item.items.map(product => (
                            <Text key={product.productId}>
                                {product.productName} x{product.qty} - ${product.price * product.qty * 1.19}
                            </Text>
                        ))}
                        <Text style={styles.saleTotal}>Total: ${item.total * 1.19}</Text>
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Seleccionar Productos</Text>
                        <FlatList
                            data={products}
                            keyExtractor={p => p.id}
                            renderItem={({ item }) => (
                                <View style={styles.productRow}>
                                    <Text>{item.name} (Stock: {item.quantity} - Precio: {item.price})</Text>
                                    <View style={styles.productActions}>
                                        <Button
                                            title="-"
                                            onPress={() => subtractToCart(item)}
                                            disabled={!cart.find(cartItem => cartItem.productId === item.id)?.qty}
                                        />
                                        <Button
                                            title="+"
                                            onPress={() => addToCart(item)}
                                            disabled={item.quantity === 0}
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        {cart.length > 0 && (
                            <View style={styles.cartSection}>
                                <Text style={styles.cartTitle}>Carrito:</Text>
                                {cart.map(item => (
                                    <Text key={item.productId}>
                                        {item.productName} x{item.qty} - ${item.price * item.qty} + IVA 19% ({item.price * 1.19}) = ${item.price * item.qty * 1.19}
                                    </Text>
                                ))}
                                <Text style={styles.cartTotal}>
                                    Total: ${cart.reduce((sum, item) => sum + (item.price * item.qty * 1.19), 0)}
                                </Text>
                            </View>
                        )}

                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => {
                                setCart([]);
                                setModalVisible(false);
                            }} />
                            <Button
                                title="Confirmar Venta"
                                onPress={registerSale}
                                disabled={cart.length === 0}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 18,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginVertical: 10
    },
    item: {
        padding: 10,
        borderBottomWidth: 1
    },
    selected: {
        backgroundColor: '#ddd'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5
    },
    modalTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10
    },
    saleItem: {
        padding: 10,
        borderBottomWidth: 1,
        marginVertical: 5,
    },
    saleDate: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    saleTotal: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
    },
    productActions: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    cartSection: {
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
    },
    cartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cartTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
});