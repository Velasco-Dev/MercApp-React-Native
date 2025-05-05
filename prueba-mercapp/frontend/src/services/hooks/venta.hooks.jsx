import { useState, useCallback } from 'react';
import { obtenerVentas, crearVenta } from '../venta/venta.service';

export const useVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVentas = useCallback(async () => {
        try {
            setLoading(true);
            const data = await obtenerVentas();
            setVentas(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const registrarVenta = useCallback(async (ventaData) => {
        try {
            setLoading(true);
            await crearVenta(ventaData);
            await fetchVentas();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchVentas]);

    return {
        ventas,
        loading,
        error,
        fetchVentas,
        registrarVenta
    };
};