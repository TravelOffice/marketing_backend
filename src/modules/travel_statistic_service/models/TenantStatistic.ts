export interface TenantRevenueStatistic {
  stPk: string,
  stSk: string,
  stAt: {
    revenue: number,
  },
}

export interface TenantProfitStatistic {
  stPk: string,
  stSk: string,
  stAt: {
    profit: number,
  },
}

export interface ProficiencyTourStatistic {
  stPk: string,
  stSk: string,
  stAt: {
    id: string,
    name: string,
    revenue: number,
    cost: number,
  },
}

export interface FavouriteTourStatistic {
  stPk: string,
  stSk: string,
  stAt: {
    id: string,
    name: string,
  },
}

export interface FavouriteLocationStatistic {
  stPk: string,
  stSk: string,
  stAt: {
    name: string,
  },
}

export interface FillingRatioTourStatistic {
  stPk: string,
  stSk: string,
  stAt: {
    id: string,
    name: string,
  },
}
