import { UpdateBookingCustomerDto } from '../../models/dto/UpdateBookingCustomerDto';
import { Customer } from '../../models/Customer';

export interface UpdateBookingCustomerUseCase {
    invoke: (tenant: string,
        bookingId: string,
        customer: UpdateBookingCustomerDto,
    ) => Promise<Partial<Customer>>;
}
