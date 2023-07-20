import { helper } from 'core';
import { DepartureTour, operationStatusTransitionRules } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { UpdateDepartureTourUseCase } from './interfaces/UpdateDepartureTourUseCase';
import { OPERATION_STATUS_INDEX, STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';
import logger from '../utils/logger';

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
    'operationStatus',
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

    // Verify status transition
    const currentOperationStatus = existingDepartureTour.operationStatus;
    const toOperationStatus = departureTour.operationStatus;
    const transition = `${currentOperationStatus}-${toOperationStatus}`;
    if (!operationStatusTransitionRules.includes(transition)) {
      throw new Error(`Invalid status transition: ${transition}`);
    }
    logger.log('Departure tour information validated successfully.');

    if (!existingDepartureTour.assigneeId && toOperationStatus !== 'WAITING_FOR_OPERATION') {
      throw new Error('Operation status could not be changed without operator');
    }

    const departureTourToUpdate: DepartureTour = {
      ...existingDepartureTour,
      ...helper.extractDataFromObject(departureTour, this.allowedUpdatingKeys),
      updatedAt: now,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${departureTour.status}`,
      lsi4: `${OPERATION_STATUS_INDEX}#${departureTour.operationStatus}`,
    };

    await departureTourRepository.update(
      tenantId,
      departureTourId,
      departureTourToUpdate,
    );

    return helper.excludeDataFromObject(departureTourToUpdate) as DepartureTour;
  };
}
