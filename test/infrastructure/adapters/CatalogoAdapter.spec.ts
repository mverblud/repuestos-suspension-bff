import { CatalogoAdapter } from '../../../src/infrastructure/adapters/CatalogoAdapter';
import type { SadarCatalogoPart } from '../../../src/domain/models/Producto';

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

import { readFile, writeFile } from 'fs/promises';

const mockReadFile = jest.mocked(readFile);
const mockWriteFile = jest.mocked(writeFile);

const partA: SadarCatalogoPart = {
  codigo: 'ABC001',
  variantes: [
    {
      variant_id: 'ABC001__1',
      posicion: 'Delantero',
      estructura: 'P',
      aplicacion: '',
      dimensional: { abierto: '', cerrado: '', superior: '', inferior: '' },
      equivalencia: [],
      aplicaciones: [
        {
          fabricante: 'FORD',
          modelo: 'FALCON',
          tipo: 'Automóvil',
          desde: 1990,
          hasta: 2000,
        },
      ],
    },
  ],
};

const partB: SadarCatalogoPart = {
  codigo: 'ABC002',
  variantes: [],
};

function makeDoc(parts: SadarCatalogoPart[]) {
  return {
    metadata: {
      total_codes: parts.length,
      total_variants: 0,
      total_vehicle_links: 0,
      codes_with_multiple_variants: 0,
      placeholder_application_count: 0,
    },
    parts,
  };
}

const FILE_PATH = '/fake/catalogo.sadar.json';

describe('CatalogoAdapter', () => {
  let adapter: CatalogoAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    adapter = new CatalogoAdapter({ catalogoFilePath: FILE_PATH });
  });

  describe('obtenerTodos', () => {
    it('devuelve todas las parts del archivo', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA, partB])) as never);

      const result = await adapter.obtenerTodos();

      expect(result).toHaveLength(2);
      expect(result[0].codigo).toBe('ABC001');
      expect(mockReadFile).toHaveBeenCalledWith(FILE_PATH, 'utf8');
    });
  });

  describe('obtenerPorCodigo', () => {
    it('devuelve la part cuando el codigo existe', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA, partB])) as never);

      const result = await adapter.obtenerPorCodigo('ABC001');

      expect(result).toEqual(partA);
    });

    it('devuelve null cuando el codigo no existe', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA])) as never);

      const result = await adapter.obtenerPorCodigo('NOEXISTE');

      expect(result).toBeNull();
    });
  });

  describe('crear', () => {
    it('agrega la part al archivo y la devuelve', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA])) as never);
      mockWriteFile.mockResolvedValue(undefined as never);

      const result = await adapter.crear(partB);

      expect(result).toEqual(partB);
      const written = JSON.parse((mockWriteFile.mock.calls[0][1] as string));
      expect(written.parts).toHaveLength(2);
      expect(written.parts[1].codigo).toBe('ABC002');
    });

    it('actualiza los contadores de metadata al escribir', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([])) as never);
      mockWriteFile.mockResolvedValue(undefined as never);

      await adapter.crear(partA);

      const written = JSON.parse((mockWriteFile.mock.calls[0][1] as string));
      expect(written.metadata.total_codes).toBe(1);
      expect(written.metadata.total_variants).toBe(1);
      expect(written.metadata.total_vehicle_links).toBe(1);
    });
  });

  describe('actualizar', () => {
    it('actualiza la part existente y la devuelve', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA])) as never);
      mockWriteFile.mockResolvedValue(undefined as never);

      const cambios = { variantes: [] };
      const result = await adapter.actualizar('ABC001', cambios);

      expect(result?.codigo).toBe('ABC001');
      expect(result?.variantes).toEqual([]);
    });

    it('devuelve null si el codigo no existe', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA])) as never);

      const result = await adapter.actualizar('NOEXISTE', {});

      expect(result).toBeNull();
      expect(mockWriteFile).not.toHaveBeenCalled();
    });
  });

  describe('eliminar', () => {
    it('elimina la part y devuelve true', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA, partB])) as never);
      mockWriteFile.mockResolvedValue(undefined as never);

      const result = await adapter.eliminar('ABC001');

      expect(result).toBe(true);
      const written = JSON.parse((mockWriteFile.mock.calls[0][1] as string));
      expect(written.parts).toHaveLength(1);
      expect(written.parts[0].codigo).toBe('ABC002');
    });

    it('devuelve false si el codigo no existe', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify(makeDoc([partA])) as never);

      const result = await adapter.eliminar('NOEXISTE');

      expect(result).toBe(false);
      expect(mockWriteFile).not.toHaveBeenCalled();
    });
  });
});
