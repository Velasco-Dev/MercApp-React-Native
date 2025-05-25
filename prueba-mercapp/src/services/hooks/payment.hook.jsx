import { useState, useCallback } from 'react';

import {
    PAYU_CONFIG,
    generateReferenceCode,
    generateSignature,
    generatePayUForm,
    getPayUFormUrl,
    getDeviceInfo
} from '../config/payment';

/**
 * Hook personalizado para manejar pagos con PayU
 */
export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [paymentResult, setPaymentResult] = useState(null);
    const [checkoutHtml, setCheckoutHtml] = useState('');

    /**
     * Prepara un pago para realizar mediante API PayU
     * @param {Object} paymentData Datos del pago
     */

    const createPayment = useCallback(async (paymentData) => {
        try {
            setLoading(true);
            setError(null);

            // Añadir información del dispositivo
            const deviceInfo = await getDeviceInfo();
            const paymentWithDevice = {
                ...paymentData,
                deviceSessionId: `${Date.now()}`,
                ipAddress: deviceInfo.ipAddress,
                userAgent: deviceInfo.userAgent,
                cookie: `cookie_${Date.now()}`
            };

            // Realizar el pago a través del servicio de PayU
            const result = await payuService.createPayment(paymentWithDevice);

            setPaymentResult(result);
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message || 'Error procesando el pago');
            setLoading(false);
            throw err;
        }
    }, []);

    /**
     * Prepara un formulario de checkout para redirección a PayU
     * @param {Object} paymentData Datos del pago
     */
    const prepareCheckout = useCallback(async (paymentData) => {
        try {
            setLoading(true);
            setError(null);

            // Validar datos requeridos
            if (!paymentData.amount || !paymentData.buyerEmail) {
                throw new Error('Faltan datos requeridos para el pago');
            }

            // Generamos datos para el formulario
            const referenceCode = generateReferenceCode();

            const signature = generateSignature(
                PAYU_CONFIG.apiKey,
                PAYU_CONFIG.merchantId,
                referenceCode,
                paymentData.amount,
                paymentData.currency || 'COP'
            );

            console.log('Payment Data:', {
                referenceCode,
                amount: paymentData.amount,
                currency: paymentData.currency || 'COP',
                signature
            });

            // Preparamos datos del formulario
            const formData = {
                merchantId: PAYU_CONFIG.merchantId,
                accountId: PAYU_CONFIG.accountId,
                description: paymentData.description || 'Compra en MercApp',
                referenceCode: referenceCode,
                amount: paymentData.amount,
                currency: paymentData.currency || 'COP',
                signature: signature,
                buyerEmail: paymentData.buyerEmail,
                buyerName: paymentData.buyerName || 'Cliente MercApp',
                responseUrl: PAYU_CONFIG.responseUrl,
                confirmationUrl: PAYU_CONFIG.confirmationUrl
            };

            // Importamos la función para generar el formulario PayU
            // const { generatePayUForm } = require('../services/payuUtils');
            // const html = generatePayUForm(formData, getPayUFormUrl());
            const formUrl = 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu';
            const html = generatePayUForm(formData, formUrl);

            setCheckoutHtml(html);
            setLoading(false);
            return html;
        } catch (err) {
            console.error('Error preparando checkout:', err);
            setError(err.message || 'Error preparando el checkout');
            setLoading(false);
            throw err;
        }
    }, []);

    /**
     * Consulta el estado de un pago
     * @param {String} orderId ID de la orden
     */
    const checkPaymentStatus = useCallback(async (orderId) => {
        try {
            setLoading(true);
            setError(null);

            const result = await payuService.getPaymentStatus(orderId);

            setPaymentResult(result);
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message || 'Error consultando el estado del pago');
            setLoading(false);
            throw err;
        }
    }, []);

    const resetPayment = useCallback(() => {
        setLoading(false);
        setError(null);
        setCheckoutHtml('');
    }, []);

    return {
        loading,
        error,
        resetPayment,
        // paymentResult,
        checkoutHtml,
        // createPayment,
        prepareCheckout,
        // checkPaymentStatus,
        // getPayUFormUrl,
    };
};