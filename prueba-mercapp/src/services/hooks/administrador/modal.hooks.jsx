import { useState, useCallback } from 'react';
import { obtenerVentasAdmin, obtenerProductosAdmin } from '../../administrador/modal.service';

export const useVentasAdmin = () => {
    const [ventasAdmin, setVentasAdmin] = useState([]);
    const [loadingAdmin, setLoadingAdmin] = useState(false);
    const [errorAdmin, setErrorAdmin] = useState(null);

    const fetchVentasAdmin = useCallback(async () => {
        try {
            setLoadingAdmin(true);
            const data = await obtenerVentasAdmin();
            setVentasAdmin(data);
            setErrorAdmin(null);
        } catch (err) {
            setErrorAdmin(err.message);
        } finally {
            setLoadingAdmin(false);
        }
    }, []);

    return {
        ventasAdmin,
        loadingAdmin,
        errorAdmin,
        fetchVentasAdmin,
    };
};

export const useProductosAdmin = () => {
    const [productosAdmin, setProductosAdmin] = useState([]);
    const [loadingAdmin, setLoadingAdmin] = useState(false);
    const [errorAdmin, setErrorAdmin] = useState(null);

    const fetchProductosAdmin = useCallback(async () => {
        try {
            setLoadingAdmin(true);
            const data = await obtenerProductosAdmin();
            setProductosAdmin(data);
            setErrorAdmin(null);
        } catch (err) {
            setErrorAdmin(err.message);
        } finally {
            setLoadingAdmin(false);
        }
    }, []);

    return {
        productosAdmin,
        loadingAdmin,
        errorAdmin,
        fetchProductosAdmin,
    };
};