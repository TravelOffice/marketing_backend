export interface LinkedLeadOrTourInfo {
    isAvailable: boolean,
    postId?: string,
    totalOffers?: number,
}

export enum linkedLeadOrTourTemplateType {
    LEAD = 'LEAD',
    TOUR_TEMPLATE = 'TOUR_TEMPLATE',
}

export const linkedLeadOrTourTemplateTypes = Object.keys(linkedLeadOrTourTemplateType);
