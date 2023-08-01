import { Estimation } from '../../models/Estimation';

export interface EstimationRepository {
  list(tenantId: string, tourId: string): Promise<Array<Estimation>>,
  create(tenantId: string, tourId: string, estimation: Estimation): Promise<Estimation>,
  get(tenantId: string, tourId: string, id: string): Promise<Estimation | undefined>,
  update(
    tenantId: string,
    tourId: string,
    id: string,
    estimation: Partial<Estimation>
  ): Promise<Estimation>,
  delete(tenantId: string, tourId: string, id: string): Promise<void>,
  generateId(tenantId: string, tourId: string): Promise<string>,
}
