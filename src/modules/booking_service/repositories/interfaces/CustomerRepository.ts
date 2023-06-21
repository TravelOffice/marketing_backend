import { Customer } from '../../models/Customer';

export interface CustomerRepository {
    findOneByPhone: (tenant: string, phone: string) => Promise<Customer | undefined>,
    create: (tenant: string, customer: Customer) => Promise<Customer | undefined>,
    generateCode: (tenant: string) => Promise<string>,
}
