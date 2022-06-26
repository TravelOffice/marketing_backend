import { Note } from './Note';
import { Task } from './Task';

export enum OpportunityStatusEnum {
  INITIALIZED = 'INITIALIZED',
  ADVISORY = 'ADVISORY',
  PRICE_QUOTE = 'PRICE_QUOTE',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export enum OpportunitySourceEnum {
  MARKETING = 'MARKETING',
  CUSTOMER_REFERRALS = 'CUSTOMER_REFERRALS',
  PROACTIVE_CUSTOMERS = 'PROACTIVE_CUSTOMERS',
  SALESMAN = 'SALESMAN',
  OTHERS = 'OTHERS',
}

export enum OpportunityPotentialTypeEnum {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export type OpportunityStatus = keyof typeof OpportunityStatusEnum;
export type OpportunitySource = keyof typeof OpportunitySourceEnum;
export type OpportunityPotentialType = keyof typeof OpportunityPotentialTypeEnum;

export interface Opportunity {
  leadName: string,
  leadId: string,
  name: string,
  source: OpportunitySource,
  description: string,
  status: OpportunityStatus,
  closedLostReason: string,
  estimatedRevenue: number,
  estimatedConfirmDate: string,
  actualCloseDate: string,
  createdAt: number,
  updatedAt: number,
  potential: OpportunityPotentialType,
  assigneeId: string, // TODO: Owner is sale person. Integrate sale management in the near future
  notes?: Note[],
  tasks?: Task[],
}

export const opportunityStatuses = Object.keys(OpportunityStatusEnum) as Array<OpportunityStatus>;
export const opportunitySources = Object.keys(OpportunitySourceEnum) as Array<OpportunitySource>;
export const opportunityPotentials = Object.keys(
  OpportunityPotentialTypeEnum,
) as Array<OpportunityPotentialType>;
