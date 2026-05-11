import { createContainer, asClass, asValue, InjectionMode, type AwilixContainer } from 'awilix';
import { AsmClient } from '../adapters/AsmClient';
import { RamosClient } from '../adapters/RamosClient';
import { RamosAdapter } from '../adapters/RamosAdapter';
import { RamosAuthService } from '../adapters/RamosAuthService';
import { AsmAdapter } from '../adapters/AsmAdapter';
import { RubroEquivalenciaAdapter } from '../adapters/RubroEquivalenciaAdapter';
import { MarcaAdapter } from '../adapters/MarcaAdapter';
import { ModeloAdapter } from '../adapters/ModeloAdapter';
import { AuthService } from '../adapters/AuthService';
import { ObtenerProductosSuspensionUseCase } from '../../application/use-cases/ObtenerProductosSuspensionUseCase';
import { ObtenerRubrosUseCase } from '../../application/use-cases/ObtenerRubrosUseCase';
import { ObtenerAutosUseCase } from '../../application/use-cases/ObtenerAutosUseCase';
import { ProductosController } from '../http/controllers/ProductosController';
import { RubrosController } from '../http/controllers/RubrosController';
import { AutosController } from '../http/controllers/AutosController';

interface Cradle {
  ramosBaseUrl: string;
  rmUsername: string;
  rmPassword: string;
  asmBaseUrl: string;
  asmUsername: string;
  asmPassword: string;
  authService: AuthService;
  ramosAuthService: RamosAuthService;
  asmClient: AsmClient;
  ramosClient: RamosClient;
  ramosProductoRepository: RamosAdapter;
  asmProductoRepository: AsmAdapter;
  rubroEquivalenciaRepository: RubroEquivalenciaAdapter;
  marcaRepository: MarcaAdapter;
  modeloRepository: ModeloAdapter;
  obtenerProductosUseCase: ObtenerProductosSuspensionUseCase;
  obtenerRubrosUseCase: ObtenerRubrosUseCase;
  obtenerAutosUseCase: ObtenerAutosUseCase;
  productosController: ProductosController;
  rubrosController: RubrosController;
  autosController: AutosController;
}

export function buildContainer(): AwilixContainer<Cradle> {
  const container = createContainer<Cradle>({ injectionMode: InjectionMode.PROXY });

  container.register({
    ramosBaseUrl: asValue(process.env.RAMOS_BASE_URL ?? 'http://localhost:3001'),
    rmUsername: asValue(process.env.RM_USERNAME ?? ''),
    rmPassword: asValue(process.env.RM_PASSWORD ?? ''),
    asmBaseUrl: asValue(process.env.ASM_BASE_URL ?? 'http://localhost:3000'),
    asmUsername: asValue(process.env.ASM_USERNAME ?? ''),
    asmPassword: asValue(process.env.ASM_PASSWORD ?? ''),
    authService: asClass(AuthService).singleton(),
    ramosAuthService: asClass(RamosAuthService).singleton(),
    asmClient: asClass(AsmClient).singleton(),
    ramosClient: asClass(RamosClient).singleton(),
    ramosProductoRepository: asClass(RamosAdapter).singleton(),
    asmProductoRepository: asClass(AsmAdapter).singleton(),
    rubroEquivalenciaRepository: asClass(RubroEquivalenciaAdapter).singleton(),
    marcaRepository: asClass(MarcaAdapter).singleton(),
    modeloRepository: asClass(ModeloAdapter).singleton(),
    obtenerProductosUseCase: asClass(ObtenerProductosSuspensionUseCase).singleton(),
    obtenerRubrosUseCase: asClass(ObtenerRubrosUseCase).singleton(),
    obtenerAutosUseCase: asClass(ObtenerAutosUseCase).singleton(),
    productosController: asClass(ProductosController).singleton(),
    rubrosController: asClass(RubrosController).singleton(),
    autosController: asClass(AutosController).singleton(),
  });

  return container;
}
