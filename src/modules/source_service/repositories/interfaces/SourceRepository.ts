import { Source } from '../../models/Source';

export interface SourceRepository {
  list(tenantId: string): Promise<Array<Source>>,
  create(tenantId: string, source: Source): Promise<Source>,
  get(tenantId: string, id: string): Promise<Source|undefined>,
  update(tenantId: string, id: string, source: Partial<Source>): Promise<Source>,
  delete(tenantId: string, id: string): Promise<void>,
  generateSourceCode(tenantId: string): Promise<string>,
}
