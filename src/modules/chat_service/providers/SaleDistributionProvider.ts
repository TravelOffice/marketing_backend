import { PriorityRoundRobin } from 'round-robin-js';
import { DDBUser } from '../models/dynamodb/DDBUser';

export default class SaleDistributionProvider {
  /**
   * Get assigned user for new conversation
   * This process use `Round Robin` algorithm to pick approriated user
   * Also, user who has lowest number of assigned chats will be prioritized
   * @param sales Sales list of organization
   * @returns User who will be assigned to new conversation
   */
  getAssignedUser = (sales: DDBUser[]): DDBUser => {
    const availableSales = new PriorityRoundRobin<DDBUser>(
      // Select next available server with lowest load
      (a: DDBUser, b: DDBUser) => a.nacs! - b.nacs!,
      sales,
    );
    const { value } = availableSales.next();
    return value;
  };
}
