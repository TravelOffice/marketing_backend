import { getEnv } from 'get-env';
import { helper } from 'core';
import { departureTourRepository, userRepository } from '../repositories';
import { ChangeAssigneeUseCase } from './interfaces/ChangeAssigneeUseCase';
import logger from '../utils/logger';
import sendEmail from '../utils/email';
import { OPERATOR_MANAGER_ROLE } from '../utils/constants';
import { MailTemplate } from '../models/MailTemplate';
import { DepartureTour } from '../models/DepartureTour';

export default class ChangeAssigneeUseCaseImpl implements ChangeAssigneeUseCase {
  /**
   * Assigns a departure tour to a specific assignee.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} departureTourId - The ID of the departure tour.
   * @param {string} assigneeId - The ID of the assignee.
   * @returns {Promise<DepartureTour>} - A promise that resolves to the updated departure tour.
   * @throws {Error} - If the assignee or the departure tour does not exist.
   */
  invoke = async (tenantId: string, departureTourId: string, assigneeId: string) => {
    // Retrieve the user attributes based on the tenantId and assigneeId
    const assignee = await userRepository.getUserAttributes(tenantId, assigneeId);

    // Validate user information
    if (!assignee) {
      throw new Error(`User ${assigneeId} does not exist!`);
    }

    logger.log('User information validated successfully.');

    // Retrieve the departure tour based on the tenantId and ID
    const departureTour = await departureTourRepository.get(tenantId, departureTourId);

    // Validate departure tour information
    if (!departureTour) {
      throw new Error(`Departure tour ${departureTourId} does not exist!`);
    }

    // If the departure tour is already assigned to the given assignee,
    // return the departure tour as it is
    if (departureTour.assigneeId === assigneeId) {
      return helper.excludeDataFromObject(departureTour) as DepartureTour;
    }

    logger.log('Departure tour information validated successfully.');

    // Change the assignee of the departure tour
    const updatedDepartureTour = await departureTourRepository.changeAssignee(
      tenantId,
      departureTourId,
      assignee,
    );

    logger.log(`Assignee of Departure tour ${departureTourId} changed to ${assigneeId} successfully.`);

    // Notify the change to the operator manager
    const operatorManagers = await userRepository.listByRole(tenantId, OPERATOR_MANAGER_ROLE);
    // Send mail to Operator manager
    // TODO: In the future, tenants can configure the mail template
    const departureTourUrl = `${tenantId}.${getEnv('DEPARTURE_TOUR_URL')}/${departureTourId}`;
    const mail: MailTemplate = {
      toAddresses: [assignee.email],
      ccAddresses: operatorManagers.map((item) => item.email),
      subject: `Operate departure tour [${departureTourId}]`,
      text: `The departure tour [${departureTourId}] has been assigned to ${assignee.username}`, // For non-html client
      html: `<p>The departure tour [${departureTourId}] has been assigned to ${assignee.username}</p><a href="${departureTourUrl}">Details</a>`, // For html client
    };
    await sendEmail(getEnv('NO_REPLY_DEFAULT_EMAIL'), mail);

    return helper.excludeDataFromObject(updatedDepartureTour) as DepartureTour;
  };
}
