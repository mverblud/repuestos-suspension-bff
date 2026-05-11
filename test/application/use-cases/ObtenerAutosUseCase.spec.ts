import { ObtenerAutosUseCase } from '../../../src/application/use-cases/ObtenerAutosUseCase';
import type { IMarcaRepository } from '../../../src/application/ports/IMarcaRepository';
import type { IModeloRepository } from '../../../src/application/ports/IModeloRepository';
import type { Marca } from '../../../src/domain/mappings/Marca';
import type { Modelo } from '../../../src/domain/mappings/Modelo';

const marcas: Marca[] = [
  { id: 'toyota',     nombre: 'Toyota',     habilitado: true  },
  { id: 'ford',       nombre: 'Ford',       habilitado: true  },
  { id: 'desactivada', nombre: 'Desactivada', habilitado: false },
];

const modelos: Modelo[] = [
  { id: 'toyota-hilux',   marcaId: 'toyota', nombre: 'Hilux',   habilitado: true  },
  { id: 'toyota-corolla', marcaId: 'toyota', nombre: 'Corolla', habilitado: true  },
  { id: 'toyota-etios',   marcaId: 'toyota', nombre: 'Etios',   habilitado: false },
  { id: 'ford-ranger',    marcaId: 'ford',   nombre: 'Ranger',  habilitado: true  },
  { id: 'desactivada-x',  marcaId: 'desactivada', nombre: 'X',  habilitado: true  },
  { id: 'huerfano',       marcaId: 'inexistente', nombre: 'Huérfano', habilitado: true },
];

const marcaRepository: IMarcaRepository = {
  obtenerTodas: jest.fn().mockReturnValue(marcas),
};

const modeloRepository: IModeloRepository = {
  obtenerTodos: jest.fn().mockReturnValue(modelos),
};

describe('ObtenerAutosUseCase', () => {
  const useCase = new ObtenerAutosUseCase({ marcaRepository, modeloRepository });

  it('agrupa modelos bajo su marca por marcaId', () => {
    const result = useCase.execute({});

    const toyota = result.brands.find((b) => b.id === 'toyota');
    expect(toyota?.models.map((m) => m.id)).toEqual([
      'toyota-hilux',
      'toyota-corolla',
      'toyota-etios',
    ]);

    const ford = result.brands.find((b) => b.id === 'ford');
    expect(ford?.models.map((m) => m.id)).toEqual(['ford-ranger']);
  });

  it('mapea nombre→name y habilitado→enabled en marcas y modelos', () => {
    const result = useCase.execute({});

    const toyota = result.brands.find((b) => b.id === 'toyota');
    expect(toyota).toEqual({
      id: 'toyota',
      name: 'Toyota',
      enabled: true,
      models: expect.any(Array),
    });
    expect(toyota?.models[0]).toEqual({
      id: 'toyota-hilux',
      name: 'Hilux',
      enabled: true,
    });
  });

  it('no expone marcaId ni brandId en la respuesta de modelos', () => {
    const result = useCase.execute({});

    result.brands.forEach((brand) => {
      brand.models.forEach((model) => {
        expect(model).not.toHaveProperty('marcaId');
        expect(model).not.toHaveProperty('brandId');
      });
    });
  });

  it('total cuenta marcas, no modelos', () => {
    const result = useCase.execute({});

    expect(result.total).toBe(3);
    expect(result.brands).toHaveLength(3);
  });

  it('soloHabilitados=true filtra marcas y modelos deshabilitados', () => {
    const result = useCase.execute({ soloHabilitados: true });

    expect(result.total).toBe(2);
    expect(result.brands.map((b) => b.id)).toEqual(['toyota', 'ford']);

    const toyota = result.brands.find((b) => b.id === 'toyota');
    expect(toyota?.models.map((m) => m.id)).toEqual(['toyota-hilux', 'toyota-corolla']);
    expect(toyota?.models.every((m) => m.enabled)).toBe(true);
  });

  it('soloHabilitados=true mantiene marca habilitada con models vacío si todos sus modelos están deshabilitados', () => {
    const localMarcas: Marca[] = [{ id: 'sin-modelos', nombre: 'Sin Modelos', habilitado: true }];
    const localModelos: Modelo[] = [
      { id: 'sin-modelos-x', marcaId: 'sin-modelos', nombre: 'X', habilitado: false },
    ];
    const localUseCase = new ObtenerAutosUseCase({
      marcaRepository: { obtenerTodas: jest.fn().mockReturnValue(localMarcas) },
      modeloRepository: { obtenerTodos: jest.fn().mockReturnValue(localModelos) },
    });

    const result = localUseCase.execute({ soloHabilitados: true });

    expect(result.total).toBe(1);
    expect(result.brands[0]).toEqual({
      id: 'sin-modelos',
      name: 'Sin Modelos',
      enabled: true,
      models: [],
    });
  });

  it('devuelve models: [] cuando una marca no tiene modelos', () => {
    const localUseCase = new ObtenerAutosUseCase({
      marcaRepository: {
        obtenerTodas: jest.fn().mockReturnValue([
          { id: 'a', nombre: 'A', habilitado: true },
        ]),
      },
      modeloRepository: { obtenerTodos: jest.fn().mockReturnValue([]) },
    });

    const result = localUseCase.execute({});
    expect(result.brands[0].models).toEqual([]);
  });

  it('preserva el orden de marcas y modelos tal como vienen del repository', () => {
    const result = useCase.execute({});

    expect(result.brands.map((b) => b.id)).toEqual(['toyota', 'ford', 'desactivada']);
    const toyota = result.brands.find((b) => b.id === 'toyota');
    expect(toyota?.models.map((m) => m.id)).toEqual([
      'toyota-hilux',
      'toyota-corolla',
      'toyota-etios',
    ]);
  });

  it('ignora modelos cuyo marcaId no matchea ninguna marca', () => {
    const result = useCase.execute({});

    const allModelIds = result.brands.flatMap((b) => b.models.map((m) => m.id));
    expect(allModelIds).not.toContain('huerfano');
  });
});
