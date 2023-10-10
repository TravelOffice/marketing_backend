import { Customer } from '../Customer';

export type UpdateBookingCustomerDto = Pick<Customer,
  'name' |
  'honorific' |
  'sex' |
  'maritalStatus' |
  'primaryPhoneNumber' |
  'otherPhoneNumbers' |
  'email' |
  'address' |
  'tags' |
  'tasks' |
  'notes' |
  'assigneeId' |
  'interest' |
  'group' |
  'genitive' |
  'taxCode' |
  'level' |
  'socialLink' |
  'sourceId' |
  'birthday'
>;
