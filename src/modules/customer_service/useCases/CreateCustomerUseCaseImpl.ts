import { CreateCustomerUseCase } from './interfaces/CreateCustomerUseCase';
import { customerRepository } from '../repositories';
import { CognitoUser } from '../models/User';
import {
  ASSIGNEE_INDEX,
  CREATED_AT_INDEX,
  CREATOR_INDEX,
  PHONE_INDEX,
  UPDATED_AT_INDEX,
} from '../utils/constants';
import { Customer, CustomerLevel } from '../models/Customer';

export default class CreateCustomerUseCaseImpl implements CreateCustomerUseCase {
  /**
   * Method to create a new Customer, following steps:
   * - Create a new Customer
   * - Logging and notification to stakeholders
   * @param currentUser current user who performs this action
   * @param customer data to create a new customer
   * @return Customer an instance of customer after creating successfully
   */
  invoke = async (currentUser: CognitoUser, customer: Customer) => {
    // Check if the customer's phone number already exists in the database
    const customerInDB = await customerRepository.findOneByPhone(
      currentUser.tenant,
      customer.primaryPhoneNumber,
    );

    if (customerInDB) {
      throw new Error(`Customer with phone number ${customer.primaryPhoneNumber} already exists`);
    }

    // Prepare the customer object to be added to the database
    const now = Date.now();
    const code = await customerRepository.generateCustomerCode(currentUser.tenant);
    const creatorId = currentUser.username;
    const creatorName = currentUser.name;
    const level = customer.level ?? CustomerLevel.STANDARD;
    const customerToAdd = {
      ...customer,
      code,
      level,
      creatorId,
      creatorName,
      lsi1: `${CREATED_AT_INDEX}#${now}`, // createdAt lsi
      lsi2: `${UPDATED_AT_INDEX}#${now}`, // updatedAt lsi
      lsi3: `${PHONE_INDEX}#${customer.primaryPhoneNumber}`,
      lsi4: `${CREATOR_INDEX}#${creatorId}`,
      lsi5: `${ASSIGNEE_INDEX}#${creatorId}`,
      createdAt: now,
      updatedAt: now,
    };

    // TODO: Logging and notification

    // Create the customer in the database
    return customerRepository.create(currentUser.tenant, customerToAdd);
  };
}
