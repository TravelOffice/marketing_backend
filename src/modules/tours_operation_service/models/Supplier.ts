export const serviceTypes = [
  'TOUR',
  'ACCOMMODATION',
  'RESTAURANT',
  'VEHICLE',
  'TOUR_GUIDE',
  'TEAM_BUILDING',
  'SIGHT_SEEING_TICKET',
  'FLIGHT_TICKET',
  'OTHER',
];

export type ServiceType = typeof serviceTypes[number]

export interface Supplier {
  code: string,
  name: string,
  services: Array<ServiceType>
}
