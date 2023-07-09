import { Customer } from '../models/Customer';

export type UpdateCustomerDto = Pick<Customer,
  'name' |
  'honorific' |
  'sex' |
  'maritalStatus' |
  'primaryPhoneNumber' |
  'otherPhoneNumbers' |
  'email'|
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
  'socialLink'
>
