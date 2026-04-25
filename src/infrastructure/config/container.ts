import { createContainer, asClass, asValue, InjectionMode, type AwilixContainer } from 'awilix';
import { AsmClient } from '../adapters/AsmClient';
import { RamosClient } from '../adapters/RamosClient';
import { RamosAdapter } from '../adapters/RamosAdapter';
import { AsmAdapter } from '../adapters/AsmAdapter';
import { AuthService } from '../adapters/AuthService';
import { ObtenerProductosSuspensionUseCase } from '../../application/use-cases/ObtenerProductosSuspensionUseCase';
import { ProductosController } from '../http/controllers/ProductosController';

interface Cradle {
  ramosBaseUrl: string;
  asmBaseUrl: string;
  asmUsername: string;
  asmPassword: string;
  authService: AuthService;
  asmClient: AsmClient;
  ramosClient: RamosClient;
  ramosProductoRepository: RamosAdapter;
  asmProductoRepository: AsmAdapter;
  obtenerProductosUseCase: ObtenerProductosSuspensionUseCase;
  productosController: ProductosController;
}

export function buildContainer(): AwilixContainer<Cradle> {
  const container = createContainer<Cradle>({ injectionMode: InjectionMode.PROXY });

  container.register({
    ramosBaseUrl: asValue(process.env.RAMOS_BASE_URL ?? 'http://localhost:3001'),
    asmBaseUrl: asValue(process.env.ASM_BASE_URL ?? 'http://localhost:3000'),
    asmUsername: asValue(process.env.ASM_USERNAME ?? ''),
    asmPassword: asValue(process.env.ASM_PASSWORD ?? ''),
    authService: asClass(AuthService).singleton(),
    asmClient: asClass(AsmClient).singleton(),
    ramosClient: asClass(RamosClient).singleton(),
    ramosProductoRepository: asClass(RamosAdapter).singleton(),
    asmProductoRepository: asClass(AsmAdapter).singleton(),
    obtenerProductosUseCase: asClass(ObtenerProductosSuspensionUseCase).singleton(),
    productosController: asClass(ProductosController).singleton(),
  });

  return container;
}
