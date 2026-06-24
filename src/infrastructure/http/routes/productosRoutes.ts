import type { FastifyInstance } from 'fastify';
import type { ProductosController } from '../controllers/ProductosController';

export async function productosRoutes(
  fastify: FastifyInstance,
  controller: ProductosController,
): Promise<void> {
  fastify.post('/productos', controller.buscarProductos.bind(controller));
  fastify.post('/productos/ramos', controller.buscarProductosRamos.bind(controller));
  fastify.post('/productos/asm', controller.buscarProductosAsm.bind(controller));
  fastify.get('/productos/ov', controller.buscarProductosOV.bind(controller));
}
