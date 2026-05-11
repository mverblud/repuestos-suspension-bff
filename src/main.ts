import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { buildContainer } from './infrastructure/config/container';
import { productosRoutes } from './infrastructure/http/routes/productosRoutes';
import { rubrosRoutes } from './infrastructure/http/routes/rubrosRoutes';
import { autosRoutes } from './infrastructure/http/routes/autosRoutes';

const PORT = Number(process.env.PORT ?? 3000);
const isDev = process.env.NODE_ENV !== 'production';

const fastify = Fastify({
  logger: isDev ? { transport: { target: 'pino-pretty' } } : true,
});

async function main(): Promise<void> {
  const container = buildContainer();

  await fastify.register(cors, { origin: '*' });

  await productosRoutes(fastify, container.resolve('productosController'));
  await rubrosRoutes(fastify, container.resolve('rubrosController'));
  await autosRoutes(fastify, container.resolve('autosController'));

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
}

main().catch((err: unknown) => {
  fastify.log.error(err);
  process.exit(1);
});
