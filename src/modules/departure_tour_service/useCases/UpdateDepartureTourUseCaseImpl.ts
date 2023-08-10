import { helper } from 'core';
import { DepartureTour } from '../models/DepartureTour';
import { departureTourRepository } from '../repositories';
import { UpdateDepartureTourUseCase } from './interfaces/UpdateDepartureTourUseCase';
import { STATUS_INDEX, UPDATED_AT_INDEX } from '../utils/constants';
import { UpdateDepartureTourDto } from '../dto/UpdateDepartureTourDto';

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
    'startDate',
    'status',
  ];

  invoke = async (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour,
  ) => {
    const existingDepartureTour = await departureTourRepository.get(tenantId, departureTourId);
    if (!existingDepartureTour) {
      throw new Error(`Departure tour [${departureTourId}] not found for tenant ${tenantId}`);
    }

    // Extract allowed data to update from original departureTour object
    const allowedUpdatingData = helper.extractDataFromObject(
      departureTour,
      this.allowedUpdatingKeys,
    );

    // Filter data should be updated
    const departureTourToUpdate = await this.getDataToUpdate(
      tenantId,
      existingDepartureTour,
      allowedUpdatingData,
    );

    const updatedDepartureTour = await departureTourRepository.update(
      tenantId,
      departureTourId,
      departureTourToUpdate as DepartureTour,
    );

    return helper.excludeDataFromObject(updatedDepartureTour) as DepartureTour;
  };

  /**
   * Parse dto to data which should be used to update. This method is useful to optimize
   * the amount of data to update.
   * @param tenantId Tenant id
   * @param departureTour original departureTour object before updating
   * @param updateDepartureTourDto data to update
   * @private
   */
  private async getDataToUpdate(
    tenantId: string,
    departureTour: DepartureTour,
    updateDepartureTourDto: Partial<UpdateDepartureTourDto>,
  ) {
    let dataToUpdate: Partial<DepartureTour> = {};

    const props = Object.keys(updateDepartureTourDto);

    const now = Date.now();

    props.forEach((key) => {
      const prop = key as keyof UpdateDepartureTourDto;
      if (departureTour[prop] !== updateDepartureTourDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateDepartureTourDto[prop] };
      }
    });

    dataToUpdate.updatedAt = now;
    dataToUpdate.lsi2 = `${UPDATED_AT_INDEX}#${now}`;
    if (dataToUpdate.status) {
      dataToUpdate.lsi3 = `${STATUS_INDEX}#${dataToUpdate.status}`;
    }
    return dataToUpdate;
  }
}
