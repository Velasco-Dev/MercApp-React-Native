import React, { useState, useEffect, useMemo } from 'react';
import {
    View, Text, FlatList, Platform, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../components/themes/Colors';
import { theme } from '../components/themes/Theme';
import CustomAlert from '../components/common/CustomAlert';
import { useVentas } from '../services/hooks/venta.hooks';
import { useProductos } from '../services/hooks/producto.hooks';

import { ProductModal } from '../components/common/modals/ProductModal';

import { useAuth } from '../context/AuthContext';

import { MetodoPagoContext } from '../context/MetodoPagoContext';

export default function VendorScreen() {

    // Estados y hooks
    const { ventas, loading, error, fetchVentas, registrarVenta } = useVentas();
    const { productos, fetchProductos } = useProductos();

    const [cart, setCart] = useState([]);

    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');


    const [modalVisible, setModalVisible] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);

    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState('loading'); // 'loading' | 'success' | 'error'


    // Cargar datos iniciales
    useEffect(() => {
        fetchVentas();
        fetchProductos();
    }, [fetchVentas, fetchProductos]);

    useEffect(() => {
        setAlertTitle('Vendedor');
    }, []);

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


    const ventasPlano = React.useMemo(() => {
        if (!ventas?.data || !Array.isArray(ventas.data)) {
            console.error('Estructura de datos inválida:', ventas);
            return [];
        }

        return ventas.data.map(venta => ({
            ...venta
        }));
    }, [ventas]);

    const handleRegisterSale = async (cartItems) => {
        if (!cartItems || cartItems.length === 0) return;

        try {

            setAlertStatus('loading');
            setAlertVisible(true);

            if (!metodoPagoSeleccionado) {
                throw new Error('Seleccione un Método de Pago');
            }

            const ventaData = {
                productos: cartItems.map(item => ({
                    idProducto: item.idProducto,
                    cantidadVendida: item.cantidadVendida,
                    precioUnitario: item.precioUnitario,
                    descuentos: item.descuentos || 0
                })),
                IdMetodoPago: metodoPagoSeleccionado,
            };


            const success = await registrarVenta(ventaData);

            if (success) {

                setAlertStatus('success');

                setAlertMessage('Venta registrada exitosamente');
                setCart([]);

                await fetchVentas(); // Actualizar la lista de ventas

                setModalVisible(false);

            } else {
                setAlertStatus('error');
                setAlertMessage('Error al registrar la venta');
                setModalVisible(true);

            }

        } catch (error) {

            setModalVisible(true);

            setAlertStatus('error');
            console.error('Error al registrar venta:', error);
            setAlertMessage(error.message || 'Error al procesar la venta');

        }
    };

    const handleConfirmSale = (cartItems) => {
        // Procesar la venta con los items del carrito
        if (alertStatus === 'error') {
            setModalVisible(true);
            setAlertVisible(true);
        }

        handleRegisterSale(cartItems);
        // setModalVisible(false);
        setAlertVisible(true);
    };

    // if (loading) {
    //     return (
    //         <View style={styles.centerContainer}>
    //             <ActivityIndicator size="large" color={COLORS.PRIMARY} />
    //         </View>
    //     );
    // }

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
            <MetodoPagoContext.Provider value={{ metodoPagoSeleccionado, setMetodoPagoSeleccionado }}>

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
                            data={ventasPlano}
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
                                            {new Date(item.fechaVenta).toLocaleDateString()}
                                        </Text>
                                        <Text style={styles.saleTotal}>
                                            Total: ${item.total.toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={styles.salesList}>
                                        {item.productos.map(product => (
                                            <View key={product.idProducto} style={styles.saleProduct}>
                                                <Text style={styles.productName}>
                                                    {product.producto.nombre} x {product.cantidadVendida}
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
                        productos={productosPlano}
                        onConfirm={handleConfirmSale}
                    />

                    <CustomAlert
                        visible={alertVisible}
                        status={alertStatus}
                        title={alertTitle}
                        message={alertMessage}
                        onClose={() => {
                            if (alertStatus !== 'loading') {
                                setAlertVisible(false);
                            } // Solo resetear si no está cargando
                        }}
                    />
                </View>
            </MetodoPagoContext.Provider>
        </KeyboardAvoidingView >
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