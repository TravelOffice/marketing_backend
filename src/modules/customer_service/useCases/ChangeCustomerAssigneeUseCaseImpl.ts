import { customerRepository, userRepository } from '../repositories';
import logger from '../utils/logger';
import { ChangeCustomerAssigneeUseCase } from './interfaces/ChangeCustomerAssigneeUseCase';

export default class ChangeCustomerAssigneeUseCaseImpl implements ChangeCustomerAssigneeUseCase {
  /**
   * Invokes the change of assignee for a customer in a specific tenant.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} customerId - The phone number of the customer.
   * @param {string} assigneeId - The ID of the user to assign the customer to.
   * @returns {Promise<Customer>} - A promise that resolves to the updated customer
   * after the assignee change.
   * @throws {Error} - If the user or customer information is invalid.
   */
  invoke = async (tenantId: string, customerId: string, assigneeId: string) => {
    // Retrieve the user attributes based on the tenantId and assigneeId
    const assignee = await userRepository.getUserAttributes(tenantId, assigneeId);

    // Validate user information
    if (!assignee) {
      throw new Error(`User ${assigneeId} does not exist!`);
    }

    logger.log('User information validated successfully.');

    // Retrieve the customer based on the tenantId and phone number
    const customer = await customerRepository.get(tenantId, customerId);

    // Validate customer information
    if (!customer) {
      throw new Error('Customer does not exist!');
    }

    logger.log('Customer information validated successfully.');

    // Change the assignee of the customer
    const updatedCustomer = await customerRepository.changeAssignee(tenantId, customerId, assignee);

    logger.log(`Assignee of Customer ${customerId} changed to ${assignee} successfully.`);

    // TODO: Add notification logic

    return updatedCustomer;
  };
}
