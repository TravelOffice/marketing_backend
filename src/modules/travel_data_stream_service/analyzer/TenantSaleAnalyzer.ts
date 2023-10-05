import * as _ from 'lodash';
import { TenantSaleStatistic } from '../models/statistic/TenantSaleStatistic';
import { RequiredDynamoDBRecord } from '../types/dynamodb';
import AbstractTenantAnalyzer from './AbstractTenantAnalyzer';
import { countChangedEntities } from './simpleMetricAnalyzer';
import { getModelChangeType } from '../utils/streamRecords';
import { BOOKING_INDEX, LEAD_INDEX } from '../utils/constants';

export default class TenantSaleAnalyzer extends AbstractTenantAnalyzer {
  // Records to be analyzed
  records: RequiredDynamoDBRecord[];

  leadRecords: RequiredDynamoDBRecord[];

  bookingRecords: RequiredDynamoDBRecord[];

  // Metrics to be calculated
  private changedLeads: number = 0;

  private changedBookings: number = 0;

  constructor(tenant: string, records: RequiredDynamoDBRecord[]) {
    super(tenant);
    this.records = records;

    // Init leadRecords and bookingRecords
    const groupedModelRecords = _.groupBy(this.records, getModelChangeType);
    this.leadRecords = groupedModelRecords[LEAD_INDEX] || [];
    this.bookingRecords = groupedModelRecords[BOOKING_INDEX] || [];
  }

  get analyzedData(): TenantSaleStatistic {
    return {
      changedLeads: this.changedLeads,
      changedBookings: this.changedBookings,
    };
  }

  analyze(): Promise<void> {
    // Analyze simple changes
    // It's not needed to connect to database to handle this changes
    this.changedLeads = countChangedEntities(this.leadRecords);
    this.changedBookings = countChangedEntities(this.bookingRecords);

    // Analyze complex changes
    // Complex changes are required to connect to database to handle

    return Promise.resolve();
  }
}
