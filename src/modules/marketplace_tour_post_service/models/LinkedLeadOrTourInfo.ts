export interface PostShortedInfo {
    postId: string,
    totalOffers: number,
}

export interface LinkedLeadOrTourInfo {
    isAvailable: boolean,
    totalOffers?: number,
    posts?: PostShortedInfo[],
}

export enum linkedLeadOrTourTemplateType {
    LEAD = 'LEAD',
    TOUR_TEMPLATE = 'TOUR_TEMPLATE',
}

export const linkedLeadOrTourTemplateTypes = Object.keys(linkedLeadOrTourTemplateType);
