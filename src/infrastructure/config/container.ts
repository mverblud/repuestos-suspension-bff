import path from 'path';
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
import { CatalogoAdapter } from '../adapters/CatalogoAdapter';
import { ObtenerProductosSuspensionUseCase } from '../../application/use-cases/ObtenerProductosSuspensionUseCase';
import { ObtenerProductosRamosUseCase } from '../../application/use-cases/ObtenerProductosRamosUseCase';
import { ObtenerProductosAsmUseCase } from '../../application/use-cases/ObtenerProductosAsmUseCase';
import { ObtenerRubrosUseCase } from '../../application/use-cases/ObtenerRubrosUseCase';
import { ObtenerAutosUseCase } from '../../application/use-cases/ObtenerAutosUseCase';
import { ObtenerCatalogoUseCase } from '../../application/use-cases/ObtenerCatalogoUseCase';
import { ObtenerCatalogoPorCodigoUseCase } from '../../application/use-cases/ObtenerCatalogoPorCodigoUseCase';
import { CrearCatalogoPartUseCase } from '../../application/use-cases/CrearCatalogoPartUseCase';
import { ActualizarCatalogoPartUseCase } from '../../application/use-cases/ActualizarCatalogoPartUseCase';
import { EliminarCatalogoPartUseCase } from '../../application/use-cases/EliminarCatalogoPartUseCase';
import { JwtTokenService } from '../adapters/JwtTokenService';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { ProductosController } from '../http/controllers/ProductosController';
import { RubrosController } from '../http/controllers/RubrosController';
import { AutosController } from '../http/controllers/AutosController';
import { CatalogoController } from '../http/controllers/CatalogoController';
import { AuthController } from '../http/controllers/AuthController';

interface Cradle {
  ramosBaseUrl: string;
  rmUsername: string;
  rmPassword: string;
  asmBaseUrl: string;
  asmUsername: string;
  asmPassword: string;
  catalogoFilePath: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  authUsername: string;
  authPassword: string;
  authService: AuthService;
  ramosAuthService: RamosAuthService;
  tokenService: JwtTokenService;
  loginUseCase: LoginUseCase;
  authController: AuthController;
  asmClient: AsmClient;
  ramosClient: RamosClient;
  ramosProductoRepository: RamosAdapter;
  asmProductoRepository: AsmAdapter;
  rubroEquivalenciaRepository: RubroEquivalenciaAdapter;
  marcaRepository: MarcaAdapter;
  modeloRepository: ModeloAdapter;
  catalogoRepository: CatalogoAdapter;
  obtenerProductosUseCase: ObtenerProductosSuspensionUseCase;
  obtenerProductosRamosUseCase: ObtenerProductosRamosUseCase;
  obtenerProductosAsmUseCase: ObtenerProductosAsmUseCase;
  obtenerRubrosUseCase: ObtenerRubrosUseCase;
  obtenerAutosUseCase: ObtenerAutosUseCase;
  obtenerCatalogoUseCase: ObtenerCatalogoUseCase;
  obtenerCatalogoPorCodigoUseCase: ObtenerCatalogoPorCodigoUseCase;
  crearCatalogoPartUseCase: CrearCatalogoPartUseCase;
  actualizarCatalogoPartUseCase: ActualizarCatalogoPartUseCase;
  eliminarCatalogoPartUseCase: EliminarCatalogoPartUseCase;
  productosController: ProductosController;
  rubrosController: RubrosController;
  autosController: AutosController;
  catalogoController: CatalogoController;
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
    catalogoFilePath: asValue(
      process.env.CATALOGO_FILE_PATH ??
        path.resolve(process.cwd(), 'src/domain/mappings/catalogo.sadar.json'),
    ),
    jwtSecret: asValue(process.env.JWT_SECRET ?? ''),
    jwtExpiresIn: asValue(process.env.JWT_EXPIRES_IN ?? '8h'),
    authUsername: asValue(process.env.AUTH_USERNAME ?? ''),
    authPassword: asValue(process.env.AUTH_PASSWORD ?? ''),
    authService: asClass(AuthService).singleton(),
    ramosAuthService: asClass(RamosAuthService).singleton(),
    asmClient: asClass(AsmClient).singleton(),
    ramosClient: asClass(RamosClient).singleton(),
    ramosProductoRepository: asClass(RamosAdapter).singleton(),
    asmProductoRepository: asClass(AsmAdapter).singleton(),
    rubroEquivalenciaRepository: asClass(RubroEquivalenciaAdapter).singleton(),
    marcaRepository: asClass(MarcaAdapter).singleton(),
    modeloRepository: asClass(ModeloAdapter).singleton(),
    catalogoRepository: asClass(CatalogoAdapter).singleton(),
    obtenerProductosUseCase: asClass(ObtenerProductosSuspensionUseCase).singleton(),
    obtenerProductosRamosUseCase: asClass(ObtenerProductosRamosUseCase).singleton(),
    obtenerProductosAsmUseCase: asClass(ObtenerProductosAsmUseCase).singleton(),
    obtenerRubrosUseCase: asClass(ObtenerRubrosUseCase).singleton(),
    obtenerAutosUseCase: asClass(ObtenerAutosUseCase).singleton(),
    obtenerCatalogoUseCase: asClass(ObtenerCatalogoUseCase).singleton(),
    obtenerCatalogoPorCodigoUseCase: asClass(ObtenerCatalogoPorCodigoUseCase).singleton(),
    crearCatalogoPartUseCase: asClass(CrearCatalogoPartUseCase).singleton(),
    actualizarCatalogoPartUseCase: asClass(ActualizarCatalogoPartUseCase).singleton(),
    eliminarCatalogoPartUseCase: asClass(EliminarCatalogoPartUseCase).singleton(),
    tokenService: asClass(JwtTokenService).singleton(),
    loginUseCase: asClass(LoginUseCase).singleton(),
    productosController: asClass(ProductosController).singleton(),
    rubrosController: asClass(RubrosController).singleton(),
    autosController: asClass(AutosController).singleton(),
    catalogoController: asClass(CatalogoController).singleton(),
    authController: asClass(AuthController).singleton(),
  });

  return container;
}
