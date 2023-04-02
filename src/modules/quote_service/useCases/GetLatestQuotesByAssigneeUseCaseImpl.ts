import { Lead, LeadType } from '../models/Lead';
import { Quote, QuoteStatus } from '../models/Quote';
import { leadRepository, quoteRepository, userRepository } from '../repositories';
import { GetQuoteListByAssigneeUseCase } from './interfaces/GetLatestQuotesByAssigneeUseCase';

export default class GetQuoteListByAssigneeUseCaseImpl implements GetQuoteListByAssigneeUseCase {
  /**
   * To get a latest quote list by assignee:
   * - Step 1: Get user ID and tenant ID from dynamo db
   * - Step 2: Get all leads in the tenant having user ID as assignee ID
   * - Step 3: Get all customers in the tenant having user ID as assignne ID
   * - Step 4: Get all latest quotes of these leads and customers.
   * - Step 5: Remove sensitive attribute and merge lead, opporunity information to quote list
   * @return List of latest quote
   */
  invoke = async (userId: string, status?: QuoteStatus) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User is not existed!');
    const tenantId = userAttributes.tenant;
    const leads = await leadRepository.getLeadListByAssigneeAndStatus(
      tenantId,
      userId,
      LeadType.LEAD,
    );
    const customers = await leadRepository.getLeadListByAssigneeAndStatus(
      tenantId,
      userId,
      LeadType.CUSTOMER,
    );
    const leadsAndCustomers = [...leads, ...customers];
    const promises = leadsAndCustomers.map(
      async (item: Lead) => quoteRepository.getLatestQuotesByLeadAndStatus(
        tenantId,
        item.primaryPhoneNumber,
        status,
      ),
    );
    const quotes = await Promise.all(promises);
    return quotes.flat().map((quote: Quote) => {
      // sk: LEAD#<leadId>#OPPORTUNITY#<opportunityId>QUOTE#<quoteId>
      const splittedSk = quote.sk.split('#');
      const leadId = splittedSk[1];
      const opportunityId = splittedSk[3];
      const leadName = leadsAndCustomers.find((lead: Lead) => lead.createdAt === leadId)?.name || '';
      const {
        sk, pk, lsi1, lsi2, lsi3, lsi4, lsi5, ...returnQuote
      } = {
        ...quote, leadId, opportunityId, leadName,
      };
      return returnQuote;
    });
  };
}
