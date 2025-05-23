import { COLORS } from '../../themes/Colors';
import { theme } from '../../themes/Theme';
import { useState, useContext, useEffect } from 'react';
import {
    Platform, StyleSheet, Modal, View, FlatList,
    TouchableOpacity, Text, SafeAreaView
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { MetodoPagoContext } from '../../../context/MetodoPagoContext';

import DropDownPicker from 'react-native-dropdown-picker';

export const ProductModal = ({ visible, onClose, productos, onConfirm }) => {
    const [cart, setCart] = useState([]);
    // const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');

    const { metodoPagoSeleccionado, setMetodoPagoSeleccionado } = useContext(MetodoPagoContext);

    const metodosPago = [
        {
            idMetodoPago: 'MP001',
            nombreMetodoPago: 'Efectivo'
        },
        {
            idMetodoPago: 'MP002',
            nombreMetodoPago: 'Tarjeta Crédito'
        },
        {
            idMetodoPago: 'MP003',
            nombreMetodoPago: 'Transferencia'
        },
        {
            idMetodoPago: 'MP004',
            nombreMetodoPago: 'Nequi'
        }
    ];

    const [openMetodo, setOpenMetodo] = useState(false);
    const [itemsMetodo, setItemsMetodo] = useState([]);

    useEffect(() => {
        const lista = metodosPago.map(metodo => ({
            label: metodo.nombreMetodoPago,
            value: metodo.idMetodoPago
        }));
        setItemsMetodo(lista);
    }, []); // ← Solo se ejecuta una vez al montar

    // useEffect(() => {
    //     console.log('Productos recibidos en modal:', productos);
    // }, [productos]);

    const addToCart = (producto) => {
        const existingItem = cart.find(item => item.idProducto === producto.idProducto);

        if (existingItem) {
            setCart(cart.map(item =>
                item.idProducto === producto.idProducto
                    ? {
                        ...item,
                        cantidadVendida: item.cantidadVendida + 1,
                        subTotal: (item.cantidadVendida + 1) * (item.precioUnitario - (item.precioUnitario * item.descuentos / 100))
                    }
                    : item
            ));
        } else {
            setCart([...cart, {
                idProducto: producto.idProducto,
                idVenta: Date.now().toString(), // Temporal ID
                cantidadVendida: 1,
                precioUnitario: producto.precio,
                descuentos: producto.descuento || 0,
                subTotal: producto.precio - (producto.precio * (producto.descuento || 0) / 100)
            }]);
        }
    };

    const removeFromCart = (productoId) => {
        const existingItem = cart.find(item => item.idProducto === productoId);

        if (existingItem.cantidadVendida > 1) {
            setCart(cart.map(item =>
                item.idProducto === productoId
                    ? {
                        ...item,
                        cantidadVendida: item.cantidadVendida - 1,
                        subTotal: (item.cantidadVendida - 1) * (item.precioUnitario - (item.precioUnitario * item.descuentos / 100))
                    }
                    : item
            ));
        } else {
            setCart(cart.filter(item => item.idProducto !== productoId));
        }
    };

    return (
        // Modificar la estructura del modal:
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Registrar Venta</Text>

                    <View style={styles.modalBody}>
                        {/* Lista de Productos */}
                        <View style={styles.productList}>
                            <FlatList
                                data={productos}
                                keyExtractor={item => item.idProducto}
                                initialNumToRender={10}
                                ListEmptyComponent={() => (
                                    <Text style={{ textAlign: 'center', color: 'gray' }}>No hay productos disponibles</Text>
                                )}
                                renderItem={({ item }) => (
                                    <View style={styles.productCard}>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{item.nombre}</Text>
                                            <Text style={styles.productDetails}>
                                                Precio: ${item.precio} | Stock: {item.cantidad}
                                            </Text>
                                            {item.descuento > 0 && (
                                                <Text style={styles.discountText}>
                                                    Descuento: {item.descuento}%
                                                </Text>
                                            )}
                                        </View>

                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity
                                                style={[styles.quantityButton, styles.removeButton]}
                                                onPress={() => removeFromCart(item.idProducto)}
                                                disabled={!cart.find(cartItem => cartItem.idProducto === item.idProducto)}
                                            >
                                                <MaterialIcons name="remove" size={24} color={COLORS.BLANCO} />
                                            </TouchableOpacity>

                                            <Text style={styles.quantity}>
                                                {cart.find(cartItem => cartItem.idProducto === item.idProducto)?.cantidadVendida || 0}
                                            </Text>

                                            <TouchableOpacity
                                                style={[styles.quantityButton, styles.addButton]}
                                                onPress={() => addToCart(item)}
                                                disabled={item.cantidad === 0}
                                            >
                                                <MaterialIcons name="add" size={24} color={COLORS.BLANCO} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>

                        <View>
                            {/* Carrito */}
                            {cart.length > 0 && (
                                <View style={styles.cartContainer}>
                                    <Text style={styles.cartTitle}>Resumen de Venta</Text>
                                    <FlatList
                                        data={cart}
                                        keyExtractor={item => item.idProducto}
                                        style={styles.cartList}
                                        renderItem={({ item }) => (
                                            <View key={item.idProducto} style={styles.cartItem}>
                                                <Text style={styles.cartItemText}>
                                                    {productos.find(p => p.idProducto === item.idProducto)?.nombre}
                                                </Text>
                                                <Text style={styles.cartItemDetails}>
                                                    {item.cantidadVendida} x ${item.precioUnitario}
                                                    {item.descuentos > 0 ? ` (-${item.descuentos}%)` : ''}
                                                </Text>
                                                <Text style={styles.cartItemSubtotal}>
                                                    Subtotal: ${item.subTotal}
                                                </Text>
                                            </View>
                                        )}
                                    />
                                    <Text style={styles.totalText}>
                                        Total: ${cart.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.picker}>
                                <DropDownPicker
                                    open={openMetodo}
                                    value={metodoPagoSeleccionado} // ← usamos directamente el contexto
                                    items={itemsMetodo}
                                    setOpen={setOpenMetodo}
                                    setValue={setMetodoPagoSeleccionado} // ← usamos directamente la función del contexto
                                    setItems={setItemsMetodo}
                                    placeholder="Seleccione método de pago"
                                    style={{ marginBottom: openMetodo ? 200 : 10, zIndex: 1000 }}
                                    dropDownDirection="AUTO"
                                />
                            </View>
                        </View>
                    </View>
                    {/* Botones */}
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={[theme.button.secondary, styles.modalButton]}
                            onPress={onClose}
                        >
                            <Text style={theme.button.textPrimary}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[theme.button.primary, styles.modalButton]}
                            onPress={() => onConfirm(cart)}
                            disabled={cart.length === 0}
                        >
                            <Text style={theme.button.textPrimary}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView >
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.BLANCO,
        maxHeight: '80%',
        borderRadius: 10,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                width: '90%',
                elevation: 5,
            },
            web: {
                width: '60%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
        }),
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.TEXT,
    },
    productCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: COLORS.BACKGROUND,
        borderRadius: 8,
        width: '100%'
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.TEXT,
    },
    productDetails: {
        color: COLORS.SECONDARY,
    },
    discountText: {
        color: COLORS.ACCENT,
        fontWeight: 'bold',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: 8,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    removeButton: {
        backgroundColor: COLORS.ERROR,
    },
    addButton: {
        backgroundColor: COLORS.PRIMARY,
    },
    quantity: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    cartSummary: {
        marginTop: 20,
        padding: 15,
        backgroundColor: COLORS.BACKGROUND,
        borderRadius: 8,
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.TEXT,
    },
    cartItem: {
        marginVertical: 5,
        width: 200,
    },
    cartItemText: {
        fontSize: 16,
        color: COLORS.TEXT,
    },
    cartItemDetails: {
        color: COLORS.SECONDARY,
    },
    cartItemSubtotal: {
        color: COLORS.ACCENT,
        fontWeight: 'bold',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: COLORS.PRIMARY,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
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
    modalBody: {
        flex: 1,
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        gap: 20, // separa columnas o secciones
        paddingBottom: 10,
    },

    productList: {
        flex: 1,
        width: Platform.OS === 'web' ? '100%' : '100%',
        maxHeight: Platform.OS === 'web' ? '100%' : 300, // suficiente para Android
        borderWidth: 0, // para pruebas puedes usar 1
    },

    cartContainer: {
        flex: 1,
        marginLeft: Platform.OS === 'web' ? 10 : 0,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        width: Platform.OS === 'web' ? '80%' : '50%',
        padding: 15,
        backgroundColor: COLORS.BACKGROUND,
        borderRadius: 8,
    },

    cartList: {
        // flexGrow: 0,
        // maxHeight: 200, // para evitar que el carrito crezca demasiado
    },



    // modalBody: {
    //     flex: 1,
    //     flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    // },
    // productList: {
    //     flex: 1,
    //     maxHeight: Platform.OS === 'web' ? '100%' : '100%',
    //     maxWidth: Platform.OS === 'web' ? '70%' : 300,
    // },
    // cartContainer: {
    //     flex: Platform.OS === 'web' ? 1 : 1,
    //     marginLeft: Platform.OS === 'web' ? 30 : 5,
    //     marginTop: Platform.OS === 'web' ? 5 : 20,
    //     padding: 15,
    //     backgroundColor: COLORS.BACKGROUND,
    //     borderRadius: 8,
    // },
    // cartList: {
    //     height: '100%',
    // },
    picker: {
        marginTop: 20,
        paddingLeft: 10,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: 200,
    },
});