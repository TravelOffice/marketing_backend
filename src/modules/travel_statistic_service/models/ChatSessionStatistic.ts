export enum SessionMetric {
  TOTAL = 'total',
  TOTAL_BY_CONVERSATION = 'totalByConversation',
  TOTAL_BY_DURATION = 'totalByDuration',
  TOTAL_BY_STATUS = 'totalByStatus',
  AVERAGE_RESPONSE_TIME = 'averageResponseTime',
  TOTAL_RESPONSE_TIME_BY_CONDITION = 'totalResponseTimeByCondition',
}

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export enum Condition {
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
}

export type ResponseTimeFilterParams = {
  condition: Condition;
  comparasionTime: number;
}

export type TotalChatSessionStatisticResponse = {
  total: number;
};

export type ChatSessionQueryParams = {
  username?: string,
  conversationId?: string,
  duration?: number,
  status?: SessionStatus,
  startTime?: string,
}

export interface ChatSessionStatistic {
  lsi1: string,
  lsi2: string,
  lsi3: string,
  lsi4: string,
  sk: string,
  pk: string,
}
