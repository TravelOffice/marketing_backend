import { Customer, LatestBooking } from '../../models/Customer';

export interface CustomerRepository {
  get: (tenantId: string, customerId: string) => Promise<Customer>,
  findOneByPhone: (tenant: string, phone: string) => Promise<Customer | undefined>,
  create: (tenant: string, customer: Customer) => Promise<Customer>,
  generateCode: (tenant: string) => Promise<string>,
  updateRevenue: (tenant: string, customerId: string, bookingRevenue: number) => Promise<void>
  updateLatestBooking: (tenant: string, customerId: string, booking: LatestBooking) => Promise<void>
}
