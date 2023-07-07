import { TourTemplate } from '../../models/TourTemplate';

export interface TourTemplateRepository {
  getTourTemplate(tenantId: string, tourTemplateId: string): Promise<TourTemplate|undefined>
}
