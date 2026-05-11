export interface ObtenerAutosParams {
  soloHabilitados?: boolean;
}

export interface ModeloResponse {
  id: string;
  name: string;
  enabled: boolean;
}

export interface MarcaConModelosResponse {
  id: string;
  name: string;
  enabled: boolean;
  models: ModeloResponse[];
}

export interface ObtenerAutosResult {
  total: number;
  brands: MarcaConModelosResponse[];
}
