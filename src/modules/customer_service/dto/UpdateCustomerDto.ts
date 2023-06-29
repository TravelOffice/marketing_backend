import { Customer } from '../models/Customer';

export type UpdateCustomerDto = Pick<Customer,
  'name' |
  'honorific' |
  'nationality' |
  'sex' |
  'maritalStatus' |
  'primaryPhoneNumber' |
  'otherPhoneNumbers' |
  'email'|
  'country' |
  'province' |
  'district' |
  'ward' |
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
