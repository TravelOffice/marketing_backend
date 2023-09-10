import { TourPost } from '../models/TourPost';
import { linkedLeadOrTourTemplateType } from '../models/LinkedLeadOrTourInfo';

export type CreateTourPostDto = Pick<
    TourPost,
    // Initial status can only be 'IN_PROCESS'
    'name' |
    'description' |
    'thumbnail' |
    'type' |
    'pricePerPax' |
    'commission' |
    'expiry' |
    'autoClose' |
    'maximumPaxToTrade' |
    'endingLocation' |
    'departureDate'
> & {
    linkedToTargetCode: string;
    linkedToTargetType: linkedLeadOrTourTemplateType;
}
