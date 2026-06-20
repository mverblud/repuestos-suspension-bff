import { readFile, writeFile } from 'fs/promises';
import type { ICatalogoRepository } from '../../application/ports/ICatalogoRepository';
import type { SadarCatalogoPart } from '../../domain/models/Producto';

interface CatalogoDoc {
  metadata: {
    total_codes: number;
    total_variants: number;
    total_vehicle_links: number;
    codes_with_multiple_variants: number;
    placeholder_application_count: number;
  };
  parts: SadarCatalogoPart[];
}

export class CatalogoAdapter implements ICatalogoRepository {
  private readonly filePath: string;

  constructor({ catalogoFilePath }: { catalogoFilePath: string }) {
    this.filePath = catalogoFilePath;
  }

  private async leerArchivo(): Promise<CatalogoDoc> {
    const raw = await readFile(this.filePath, 'utf8');
    return JSON.parse(raw) as CatalogoDoc;
  }

  private async escribirArchivo(doc: CatalogoDoc): Promise<void> {
    const totalVariants = doc.parts.reduce((sum, p) => sum + p.variantes.length, 0);
    const totalVehicleLinks = doc.parts.reduce(
      (sum, p) => sum + p.variantes.reduce((s, v) => s + v.aplicaciones.length, 0),
      0,
    );
    const codesWithMultipleVariants = doc.parts.filter((p) => p.variantes.length > 1).length;

    doc.metadata = {
      ...doc.metadata,
      total_codes: doc.parts.length,
      total_variants: totalVariants,
      total_vehicle_links: totalVehicleLinks,
      codes_with_multiple_variants: codesWithMultipleVariants,
    };

    await writeFile(this.filePath, JSON.stringify(doc, null, 2), 'utf8');
  }

  async obtenerTodos(): Promise<SadarCatalogoPart[]> {
    const doc = await this.leerArchivo();
    return doc.parts;
  }

  async obtenerPorCodigo(codigo: string): Promise<SadarCatalogoPart | null> {
    const doc = await this.leerArchivo();
    return doc.parts.find((p) => p.codigo === codigo) ?? null;
  }

  async crear(part: SadarCatalogoPart): Promise<SadarCatalogoPart> {
    const doc = await this.leerArchivo();
    doc.parts.push(part);
    await this.escribirArchivo(doc);
    return part;
  }

  async actualizar(
    codigo: string,
    cambios: Partial<Omit<SadarCatalogoPart, 'codigo'>>,
  ): Promise<SadarCatalogoPart | null> {
    const doc = await this.leerArchivo();
    const idx = doc.parts.findIndex((p) => p.codigo === codigo);
    if (idx === -1) return null;

    doc.parts[idx] = { ...doc.parts[idx], ...cambios, codigo };
    await this.escribirArchivo(doc);
    return doc.parts[idx];
  }

  async eliminar(codigo: string): Promise<boolean> {
    const doc = await this.leerArchivo();
    const idx = doc.parts.findIndex((p) => p.codigo === codigo);
    if (idx === -1) return false;

    doc.parts.splice(idx, 1);
    await this.escribirArchivo(doc);
    return true;
  }
}
