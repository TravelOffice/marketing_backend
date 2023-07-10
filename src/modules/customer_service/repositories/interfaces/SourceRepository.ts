import { Source } from '../../models/Source';

export interface SourceRepository {
  get(tenantId: string, sourceId: string): Promise<Source|undefined>
}
