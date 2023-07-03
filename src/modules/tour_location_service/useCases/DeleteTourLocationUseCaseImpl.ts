import { tourLocationRepository } from '../repositories';
import { DeleteTourLocationUseCase } from './interfaces/DeleteTourLocationUseCase';

export default class DeleteTourLocationUseCaseImpl implements DeleteTourLocationUseCase {
  invoke = async (tenantId: string, id: string) => tourLocationRepository.delete(tenantId, id);
}
