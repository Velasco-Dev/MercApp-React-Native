import React, { useState, useEffect, useMemo } from 'react';
import {
    View, Text, FlatList, Platform, TouchableOpacity, StyleSheet,
    Modal, KeyboardAvoidingView, ActivityIndicator, Button
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../components/themes/Colors';
import { theme } from '../components/themes/Theme';
import CustomAlert from '../components/common/CustomAlert';
import { useVentas } from '../services/hooks/venta.hooks';
import { useProductos } from '../services/hooks/producto.hooks';

import { ProductModal } from '../components/common/modals/ProductModal';

import { useAuth } from '../context/AuthContext';

export default function VendorScreen() {

    // Estados y hooks
    const { ventas, loading, error, fetchVentas, registrarVenta } = useVentas();
    const { productos, fetchProductos } = useProductos();

    const [cart, setCart] = useState([]);

    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');


    const [modalVisible, setModalVisible] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const { userId } = useAuth();

    console.log(userId);
    

    // Cargar datos iniciales
    useEffect(() => {
        fetchVentas();
        fetchProductos();
    }, [fetchVentas, fetchProductos]);

    const handleRegisterSale = async (cartItems) => {
        if (!cartItems || cartItems.length === 0) return;
    
        try {
            // const ventaData = {
            //     items: cartItems.map(item => ({
            //         idProducto: item.idProducto,
            //         cantidadVendida: item.cantidadVendida,
            //         precioUnitario: item.precioUnitario,
            //         descuentos: item.descuentos || 0,
            //         nombre: item.nombre // si necesitas el nombre para mostrar
            //     })),
            //     total: cartItems.reduce((sum, item) => sum + item.subTotal, 0),
            //     fecha: new Date().toISOString(),
            //     estado: true
            // };
            const ventaData = {
                fechaVenta: new Date().toISOString(),
                metodoPago: {
                  nombreMetodoPago: metodoPagoSeleccionado, // ← lo seleccionas desde la UI
                  fechaEmisionResumen: new Date().toISOString()
                },
                productos: cartItems.map(item => ({
                  idProducto: item.idProducto,
                  cantidadVendida: item.cantidadVendida,
                  precioUnitario: item.precioUnitario,
                  descuentos: item.descuentos || 0
                })),
                idVenta: '01',
                vendedor: 'USER000023' // ← este valor debe venir del contexto o sesión del usuario
              };
              
    
            const success = await registrarVenta(ventaData);
            
            if (success) {
                setAlertMessage('Venta registrada exitosamente');
                setCart([]);
                await fetchVentas(); // Actualizar la lista de ventas
            } else {
                setAlertMessage('Error al registrar la venta');
            }
            setAlertVisible(true);
        } catch (error) {
            console.error('Error al registrar venta:', error);
            setAlertMessage('Error al procesar la venta');
            setAlertVisible(true);
        }
    };

    const handleConfirmSale = (cartItems) => {
        // Procesar la venta con los items del carrito
        handleRegisterSale(cartItems);
        setModalVisible(false);
    };

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
                    onPress={fetchVentas}
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
            <View style={styles.container}>
                <Text style={styles.title}>Ventas Realizadas</Text>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total del día:</Text>
                    <Text style={styles.totalAmount}>$</Text>
                    {/* {todayTotalSales} */}
                </View>

                <TouchableOpacity
                    style={theme.button.primary}
                    onPress={() => setModalVisible(true)}
                    disabled={loading}
                >
                    <Text style={theme.button.textPrimary}>
                        {loading ? 'Registrando...' : 'Nueva Venta'}
                    </Text>
                </TouchableOpacity>
                {/* <Button title="Nueva Venta" onPress={} /> */}

                <View style={styles.salesContainer}>
                    <FlatList
                        data={ventas}
                        keyExtractor={sale => sale.idVenta}
                        style={styles.salesList}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    No hay ventas registradas
                                </Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <View style={styles.saleItem}>
                                <View style={styles.saleHeader}>
                                    <Text style={styles.saleDate}>
                                        {new Date(item.fecha).toLocaleDateString()}
                                    </Text>
                                    <Text style={styles.saleTotal}>
                                        Total: ${item.total.toFixed(2)}
                                    </Text>
                                </View>
                                <View style={styles.salesList}>
                                    {item.items.map(product => (
                                        <View key={product.idProducto} style={styles.saleProduct}>
                                            <Text style={styles.productName}>
                                                {product.nombre} x{product.cantidadVendida}
                                            </Text>
                                            <Text style={styles.productPrice}>
                                                ${(product.precioUnitario * product.cantidadVendida).toFixed(2)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* // En el return */}
                <ProductModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    productos={productos}
                    onConfirm={handleConfirmSale}
                />

                <CustomAlert
                    visible={alertVisible}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        userSelect: 'none',
        cursor: 'default'
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        userSelect: 'none',
        cursor: 'default'
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
    salesContainer: {
        flex: 1,
        marginTop: 20,
    },
    salesList: {
        flex: 1,
    },
    saleItem: {
        backgroundColor: COLORS.BLANCO,
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
        }),
    },
    saleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    saleDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.TEXT,
    },
    saleProduct: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    productName: {
        color: COLORS.SECONDARY,
    },
    productPrice: {
        fontWeight: '500',
        color: COLORS.TEXT,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.SECONDARY,
        fontSize: 16,
    },
});