import { helper } from 'core';
import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import {
  CREATED_AT_INDEX,
  OPERATION_STATUS_INDEX,
  STATUS_INDEX, UPDATED_AT_INDEX,
} from '../utils/constants';
import { CreateDepartureTourUseCase } from './interfaces/CreateDepartureTourUseCase';

export default class CreateDepartureTourUseCaseImpl implements CreateDepartureTourUseCase {
  allowedCreatingKeys: (keyof DepartureTour)[] = [
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
    'creatorId',
    'creatorName',
    'operationStatus',
  ];

  invoke = async (
    tenantId: string,
    departureTour: DepartureTour,
  ) => {
    const now = Date.now();
    const code = await departureTourRepository.generateDepartureTourCode(tenantId);
    const departureTourToAdd: DepartureTour = {
      ...(helper.extractDataFromObject(departureTour, this.allowedCreatingKeys) as DepartureTour),
      code,
      createdAt: now,
      updatedAt: now,
      lsi1: `${CREATED_AT_INDEX}#${now}`,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
      lsi3: `${STATUS_INDEX}#${departureTour.status}`,
      lsi4: `${OPERATION_STATUS_INDEX}#${departureTour.operationStatus}`,
    };
    await departureTourRepository.create(tenantId, departureTourToAdd);
    return helper.excludeDataFromObject(departureTourToAdd) as DepartureTour;
  };
}
