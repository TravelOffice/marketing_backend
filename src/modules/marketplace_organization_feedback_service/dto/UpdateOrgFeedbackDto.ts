import { OrgFeedback } from '../models/OrgFeedback';

export type UpdateOrgFeedbackDto = Pick<OrgFeedback, 'description'>;
