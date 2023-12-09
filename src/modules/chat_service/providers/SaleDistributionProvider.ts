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
    // TODO: Count number of assigned chats from statistic table
    // For now, statistic table store all the conversations related to tenant or user
    // We can find list of conversations by tenant and user, then count number of assigned chats
    const availableSales = new PriorityRoundRobin<DDBUser>(
      // Select next available server with lowest load
      (a: DDBUser, b: DDBUser) => a.nacs! - b.nacs!,
      sales,
    );
    const { value } = availableSales.next();
    return value;
  };
}
