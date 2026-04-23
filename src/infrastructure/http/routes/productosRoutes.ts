import type { FastifyInstance } from 'fastify';
import type { ProductosController } from '../controllers/ProductosController';

export async function productosRoutes(
  fastify: FastifyInstance,
  controller: ProductosController,
): Promise<void> {
  fastify.post('/productos', controller.buscarProductos.bind(controller));
}
