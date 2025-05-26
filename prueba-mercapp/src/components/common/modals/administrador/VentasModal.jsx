import { COLORS } from '../../../themes/Colors';
import { theme } from '../../../themes/Theme';
import { useState, useContext, useEffect } from 'react';
import {
    Platform, StyleSheet, Modal, View, FlatList,
    TouchableOpacity, Text, SafeAreaView, Linking, Alert, TextInput, Dimensions
} from 'react-native';

import React from 'react';

import { MaterialIcons } from '@expo/vector-icons';

import { useVentasAdmin } from '../../../../services/hooks/administrador/modal.hooks';


export const VentasModal = ({ visible, onClose, onConfirm }) => {

    const { ventasAdmin, loadingAdmin, errorAdmin, fetchVentasAdmin } = useVentasAdmin();

    const [filter, setFilter] = useState('');

    const ventasPlano = React.useMemo(() => {
        if (!ventasAdmin?.data || !Array.isArray(ventasAdmin.data)) {
            console.error('Estructura de datos inválida:', ventasAdmin);
            return [];
        }

        return ventasAdmin.data.map(venta => ({
            ...venta
        }));
    }, [ventasAdmin]);

    // console.log(ventasPlano);

    const filtered = ventasPlano.filter(v =>
        v?.idVenta?.toLowerCase().includes(filter.toLowerCase()) ||
        v?.productos?.some(p => p?.nombre?.toLowerCase().includes(filter.toLowerCase())) ||
        v?.vendedor?.idPersona?.toLowerCase().includes(filter.toLowerCase()) ||
        v?.vendedor?.nombrePersona?.toLowerCase().includes(filter.toLowerCase()) ||
        v?.vendedor?.apellido?.toLowerCase().includes(filter.toLowerCase()) ||
        v?.IdMetodoPago?.toLowerCase().includes(filter.toLowerCase()) ||
        v?.estadoPago?.toLowerCase().includes(filter.toLowerCase()) ||
        v?.compradorInfo?.email?.toLowerCase().includes(filter.toLowerCase()) ||
        v?.compradorInfo?.nombre?.toLowerCase().includes(filter.toLowerCase())
    );

    useEffect(() => {
        fetchVentasAdmin();
    }, [fetchVentasAdmin]);


    if (errorAdmin) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={theme.button.primary}
                    onPress={fetchVentasAdmin}
                >
                    <Text style={theme.button.textPrimary}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Dentro del componente, antes del return
    const screenWidth = Dimensions.get('window').width;
    const numColumns = screenWidth > 1080 ? 4 : 2;

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
                    <Text style={styles.modalTitle}>Ventas</Text>

                    <View style={styles.modalBody}>
                        {/* Lista de Ventas */}
                        <View style={styles.productList}>
                            <View style={{ zIndex: 100 }}>
                                <TextInput placeholder="Buscar venta" value={filter} onChangeText={setFilter} style={[theme.inputFilter]} />
                                <Text style={[theme.subtitle]}>Ventas Registrados ({filtered?.length || 0})</Text>
                            </View>
                            <View style={styles.salesContainer}>
                                <FlatList
                                    data={filtered}
                                    keyExtractor={sale => sale.idVenta}
                                    numColumns={numColumns} // Añade esta línea para mostrar 2 columnas
                                    columnWrapperStyle={theme.row}
                                    // style={styles.salesList}
                                    ListEmptyComponent={() => (
                                        <View style={styles.emptyContainer}>
                                            <Text style={theme.emptyText}>
                                                {loadingAdmin ? 'Cargando...' : 'No hay ventas registradas'}
                                            </Text>
                                        </View>
                                    )}
                                    renderItem={({ item }) => (
                                        <View style={styles.saleItem}>
                                            <View style={styles.saleHeader}>
                                                <Text style={[styles.saleTotal, { color: theme.Colors.BLANCO }]}>
                                                    ID: {item.idVenta}
                                                </Text>
                                            </View>
                                            <View style={styles.salesList}>
                                                <Text style={[styles.saleTotal, { color: theme.Colors.ACCENT, alignSelf: 'center' }]}>
                                                    Pago: {String(item.estadoPago).toUpperCase()}
                                                </Text>
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
                                            <View style={styles.saleFooter}>
                                                <Text style={styles.saleDate}>
                                                    {new Date(item.fechaVenta).toLocaleDateString()}
                                                </Text>
                                                <Text style={styles.saleTotal}>
                                                    Total: ${item.total.toFixed(2)}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                    {/* Botones */}
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={[theme.button.secondary]}
                            onPress={onClose}
                        >
                            <Text style={theme.button.textPrimary}>Cerrar</Text>
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
                width: '100%',
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
    saleTotal: {
        fontWeight: 'bold',
    },
    productName: {
        color: COLORS.TEXT,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        width: 'auto',
    },
    salesContainer: {
        flex: 1,
        marginTop: 20,
    },
    salesList: {
        flex: 1,
        fontWeight: 'light',
        marginInline: 10
    },
    saleItem: {
        backgroundColor: COLORS.BLANCO,
        borderRadius: 10,
        // padding: 15,
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
                boxShadow: '0 4px 4px rgba(0, 0, 0, 0.26)',
            },
        }),
    },
    saleHeader: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: theme.Colors.GRIS,
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    saleFooter: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: theme.Colors.ACCENT,
        verticalAlign: 'bottom',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'space-between',
    },
    saleDate: {
        fontSize: 16,
        color: theme.Colors.GRIS,
        alignContent: 'center',
        textAlign: 'center'
    },
    saleProduct: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontWeight: 'light',
        paddingVertical: 5,
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
});