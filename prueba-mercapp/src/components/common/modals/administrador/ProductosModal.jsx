import { COLORS } from '../../../themes/Colors';
import { theme } from '../../../themes/Theme';
import { useState, useContext, useEffect } from 'react';
import {
    Platform, StyleSheet, Modal, View, FlatList,
    TouchableOpacity, Text, SafeAreaView, Linking, Alert, TextInput, Dimensions
} from 'react-native';

import React from 'react';

import { MaterialIcons } from '@expo/vector-icons';

import { useVentasAdmin, useProductosAdmin } from '../../../../services/hooks/administrador/modal.hooks';


export const ProductosModal = ({ visible, onClose, onConfirm }) => {

    const { productosAdmin, loadingAdmin, errorAdmin, fetchProductosAdmin } = useProductosAdmin();

    const [filter, setFilter] = useState('');

    // 2. Convertir el formato de API a un array plano de productos
    const productosPlano = React.useMemo(() => {
        if (!productosAdmin?.data?.categorias || !Array.isArray(productosAdmin.data.categorias)) {
            return [];
        }

        return productosAdmin.data.categorias.flatMap(categoria => {
            if (!Array.isArray(categoria.productos)) return []; // 🔒 validación segura

            return categoria.productos.map(producto => ({
                ...producto,
                categoria: categoria.nombreCategoria
            }));
        });
    }, [productosAdmin]);


    const filtered = productosPlano.filter(p =>
        p?.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        p?.idProducto.toLowerCase().includes(filter.toLowerCase()) ||
        p?.categoria.toLowerCase().includes(filter.toLowerCase())
    );

    // console.log("Productos: ", productosPlano);

    useEffect(() => {
        fetchProductosAdmin();
    }, [fetchProductosAdmin]);


    if (errorAdmin) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={theme.button.primary}
                    onPress={fetchProductosAdmin}
                >
                    <Text style={theme.button.textPrimary}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Dentro del componente, antes del return
    const screenWidth = Dimensions.get('window').width;
    const numColumns = screenWidth > 1080 ? 5 : 3;

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
                    <Text style={styles.modalTitle}>Productos</Text>

                    <View style={styles.modalBody}>
                        {/* Lista de Ventas */}
                        <View style={styles.productList}>
                            <View style={{ zIndex: 100 }}>
                                <TextInput placeholder="Buscar productos" value={filter} onChangeText={setFilter} style={[theme.inputFilter]} />
                                <Text style={[theme.subtitle]}>Productos Registrados ({filtered?.length || 0})</Text>
                            </View>
                            <View style={styles.salesContainer}>
                                <FlatList
                                    style={styles.container}
                                    data={filtered}
                                    keyExtractor={p => p.idProducto}
                                    numColumns={numColumns} // Añade esta línea para mostrar 2 columnas
                                    columnWrapperStyle={theme.row} // Añade esta línea para el estilo de las filas
                                    // style={theme.flatList}
                                    // contentContainerStyle={theme.flatListContent}
                                    ListEmptyComponent={() => (
                                        <View style={theme.emptyContainer}>
                                            <Text style={theme.emptyText}>
                                                {loadingAdmin ? 'Cargando...' : 'No hay productos registrados'}
                                            </Text>
                                        </View>
                                    )}
                                    renderItem={({ item }) => (
                                        <View style={[theme.card]}>
                                            <View style={[theme.card.header]}>
                                                <Text style={[theme.name, { color: theme.Colors.BLANCO }]}>
                                                    {item.nombre}
                                                </Text>
                                            </View>
                                            <View style={{ padding: 10 }}>
                                                <Text style={theme.info}>ID: {item.idProducto}</Text>
                                                <Text style={theme.info}>Precio: ${item.precio}</Text>
                                                <Text style={theme.info}>Stock: {item.cantidad}</Text>
                                                <Text style={theme.info}>Categoría: {item.categoria}</Text>
                                                <Text style={theme.info}>Descuento: {item.descuento}%</Text>
                                                {/* <View style={theme.card.buttonCardContainer}>
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
                                                </View> */}
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