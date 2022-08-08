import { BaseDdbModel } from "./BaseDdbModel";

// Type of sk is string
export type TypeOfSk = BaseDdbModel['sk'];

// DDB Model without indexes
export type RestrictedDDBModel<T extends BaseDdbModel> = Omit<T, 'pk' | 'sk' | 'typeLsi'>;
