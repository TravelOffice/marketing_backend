import { TourTemplateWithId } from "../../models/TourTemplate";

export interface GetTourTemplateListUseCase {
  invoke: (tenantId: string) => Promise<Array<TourTemplateWithId>>;
}
