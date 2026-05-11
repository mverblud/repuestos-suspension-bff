import { ObtenerRubrosUseCase } from '../../../src/application/use-cases/ObtenerRubrosUseCase';
import type { IRubroEquivalenciaRepository } from '../../../src/application/ports/IRubroEquivalenciaRepository';
import type { RubroEquivalencia } from '../../../src/domain/mappings/RubroEquivalencia';

const rubros: RubroEquivalencia[] = [
  {
    rubroId: 1,
    rubroName: 'AMORTIGUADORES',
    rubroHabilitado: true,
    rubroEquivalencias: {
      RM:  { rubroId: 10, rubroName: 'AMORTIGUADOR' },
      ASM: { rubroId: 3,  rubroName: 'AMORTIGUADORES' },
    },
  },
  {
    rubroId: 2,
    rubroName: 'AMORTIGUADOR RALLY',
    rubroHabilitado: false,
    rubroEquivalencias: {
      RM:  { rubroId: 12, rubroName: 'AMORTIGUADOR RALLY' },
      ASM: null,
    },
  },
  {
    rubroId: 3,
    rubroName: 'DISCO DE FRENO',
    rubroHabilitado: true,
    rubroEquivalencias: {
      RM:  { rubroId: 50, rubroName: 'DISCO DE FRENO' },
      ASM: { rubroId: 30, rubroName: 'DISCOS DE FRENO' },
    },
  },
];

const rubroEquivalenciaRepository: IRubroEquivalenciaRepository = {
  obtenerTodos: jest.fn().mockReturnValue(rubros),
};

describe('ObtenerRubrosUseCase', () => {
  const useCase = new ObtenerRubrosUseCase({ rubroEquivalenciaRepository });

  it('returns all rubros when soloHabilitados is not set', () => {
    const result = useCase.execute({});

    expect(result.total).toBe(3);
    expect(result.rubros).toHaveLength(3);
    expect(result.rubros[0]).toEqual({
      rubroId: 1,
      rubroNombre: 'AMORTIGUADORES',
      rubroHabilitado: true,
      equivalencias: {
        RM:  { rubroId: 10, rubroName: 'AMORTIGUADOR' },
        ASM: { rubroId: 3,  rubroName: 'AMORTIGUADORES' },
      },
    });
  });

  it('returns only enabled rubros when soloHabilitados is true', () => {
    const result = useCase.execute({ soloHabilitados: true });

    expect(result.total).toBe(2);
    expect(result.rubros.every((r) => r.rubroHabilitado)).toBe(true);
    expect(result.rubros.map((r) => r.rubroId)).toEqual([1, 3]);
  });

  it('normalizes nombre to rubroNombre in the response', () => {
    const result = useCase.execute({});

    result.rubros.forEach((r) => {
      expect(r).toHaveProperty('rubroNombre');
      expect(r).not.toHaveProperty('rubroName');
    });
  });
});
