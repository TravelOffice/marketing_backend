export interface Service {
  // TODO: Need complete other attributes in feature
  id: string,
  name: string,
}

export enum PassengerType {
  ADULT = 'ADULT',
  PERSON_U11 = 'PERSON_U11', // Children from 6 to 11
  PERSON_U6 = 'PERSON_U6', // Children under 6
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  DISCUSSING = 'DISCUSSING',
  REJFECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

export interface QuoteItem {
  serviceId: string,
  serviceName: string,
  passengerType: PassengerType,
  quantity: number,
  unitPrice: number,
}

export interface Attachment {
  name: string,
  url: string,
  createdAt: string,
}

export interface Quote {
  sk: string,
  pk: string,
  typeLsi: string,
  leadId: string,
  leadName: string,
  opportunityId: string,
  status: QuoteStatus,
  code: string,
  name: string,
  createdAt: string,
  updatedAt: string,
  creatorId: string,
  creatorName: string,
  quoteFile?: Attachment,
  attachments?: Attachment[],
  items: QuoteItem[],
  subTotal: number,
  discount: number,
  taxRate: number,
}
