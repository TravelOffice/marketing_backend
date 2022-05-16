import { Opportunity } from '../../models/Opportunity';

export interface GetMyOpportunitiesUseCase {
  invoke: (userId: string) => Promise<Array<Opportunity>>;
}
