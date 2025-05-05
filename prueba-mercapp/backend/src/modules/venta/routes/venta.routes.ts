import { Router } from 'express';
import { crearVenta, obtenerTotalDia, filtrarPorVendedor } from '../controllers/venta.controller';

const router = Router();

router.post('/registrar-venta', crearVenta);
router.get('/venta/total', obtenerTotalDia);
router.get('/venta/vendedor', filtrarPorVendedor);

export  {router};