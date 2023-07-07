import {
  locationRepository, sourceRepository, tourTemplateRepository, userRepository,
} from '../repositories';

export default class BaseRepositoryImpl {
  protected async getSource(tenant: string, sourceId: string) {
    const source = await sourceRepository.get(tenant, sourceId);
    if (!source) throw new Error(`Could not found source with id ${sourceId}`);
    return source;
  }

  protected async getAssignee(tenant: string, assigneeId?: string) {
    if (!assigneeId) return undefined;
    const assignee = await userRepository.getUserAttributes(tenant, assigneeId);
    if (!assignee) throw new Error(`Could not found assignee with id ${assignee}`);
    return assignee;
  }

  protected async getTourTemplate(tenant: string, tourTemplateId?: string) {
    if (!tourTemplateId) return undefined;
    const tourTemplate = await tourTemplateRepository.getTourTemplate(tenant, tourTemplateId);
    if (!tourTemplate) throw new Error(`Could not found tour template with id ${tourTemplateId}`);
    return tourTemplate;
  }

  protected async getTourLocation(tenant: string, locationId: string) {
    const location = await locationRepository.get(tenant, locationId);
    if (!location) throw new Error(`Could not found location with id ${locationId}`);
    return location;
  }
}
