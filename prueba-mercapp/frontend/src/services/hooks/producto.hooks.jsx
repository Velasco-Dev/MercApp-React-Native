import { useState, useCallback } from 'react';
import { obtenerProductos, crearProducto, editarProducto } from '../producto/producto.service';

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProductos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await obtenerProductos();
            setProductos(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const addProducto = useCallback(async (productoData) => {
        try {
            setLoading(true);
            await crearProducto(productoData);
            await fetchProductos(); // Recargar la lista después de crear
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchProductos]);

    const updateProducto = useCallback(async (id, productoData) => {
        try {
            setLoading(true);
            await editarProducto(id, productoData);
            await fetchProductos();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchProductos]);

    return {
        productos,
        loading,
        error,
        fetchProductos,
        addProducto,
        updateProducto
    };
};