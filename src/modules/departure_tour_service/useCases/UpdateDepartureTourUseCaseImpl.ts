import { helper } from 'core';
import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { UpdateDepartureTourUseCase } from './interfaces/UpdateDepartureTourUseCase';
import { STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';

export default class UpdateDepartureTourUseCaseImpl implements UpdateDepartureTourUseCase {
  allowedUpdatingKeys: (keyof DepartureTour)[] = [
    'name',
    'type',
    'visitorCount',
    'startingLocation',
    'endingLocation',
    'durationInDays',
    'durationInNights',
    'services',
    'policiesAndRegulations',
    'tourPlan',
    'tourTemplate',
    'tourTemplateCode',
    'startDate',
    'status',
  ];

  invoke = async (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour,
  ) => {
    const now = Date.now();
    const existingDepartureTour = await departureTourRepository.get(tenantId, departureTourId);
    if (!existingDepartureTour) {
      throw new Error(`Departure tour [${departureTourId}] not found for tenant ${tenantId}`);
    }

    const departureTourToUpdate: DepartureTour = {
      ...existingDepartureTour,
      ...helper.extractDataFromObject(departureTour, this.allowedUpdatingKeys),
      updatedAt: now,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${departureTour.status}`,
    };

    await departureTourRepository.update(
      tenantId,
      departureTourId,
      departureTourToUpdate,
    );

    return helper.excludeDataFromObject(departureTourToUpdate) as DepartureTour;
  };
}
