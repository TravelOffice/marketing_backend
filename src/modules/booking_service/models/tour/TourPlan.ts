export type DailyKey = `DAY_${number}`

export enum TourPlanActivityType {
  // Breakfast, lunch, dinner or party
  MEAL = 'MEAL',
  PARTY = 'PARTY',
  // Move by taxi, bus, motocycle
  LOCAL_MOVE = 'LOCAL_MOVE',
  FLIGHT_MOVE = 'FLIGHT_MOVE',
  /**
   * Travel activity type
   * Can be LEISURE, KAYAKING, ADVENTURE, DIVING
   */
  LEISURE = 'LEISURE',
  KAYAKING = 'KAYAKING',
  ADVENTURE = 'ADVENTURE',
  DIVING = 'DIVING',
  TREKKING = 'TREKKING',
  // Others
  CHECKIN = 'CHECKIN',
  CHECKOUT = 'CHECKOUT',
  OTHER = 'OTHER',
}

export interface DailyTourPlanItem {
  startTime: string,
  endTime: string,
  activityType: TourPlanActivityType,
  description: string,
  estimationId: string,
}

export interface TourPlan {
  [key: DailyKey]: DailyTourPlanItem[]
}
