export interface IEliminarCatalogoPartUseCase {
  execute(codigo: string): Promise<boolean>;
}
