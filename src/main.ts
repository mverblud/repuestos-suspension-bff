import 'dotenv/config';
import Fastify from 'fastify';
import { buildContainer } from './infrastructure/config/container';
import { productosRoutes } from './infrastructure/http/routes/productosRoutes';

const PORT = Number(process.env.PORT ?? 3000);
const isDev = process.env.NODE_ENV !== 'production';

const fastify = Fastify({
  logger: isDev ? { transport: { target: 'pino-pretty' } } : true,
});

async function main(): Promise<void> {
  const container = buildContainer();
  const productosController = container.resolve('productosController');

  await productosRoutes(fastify, productosController);
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
}

main().catch((err: unknown) => {
  fastify.log.error(err);
  process.exit(1);
});
