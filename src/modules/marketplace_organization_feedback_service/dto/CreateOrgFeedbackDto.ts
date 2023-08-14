import { OrgFeedback } from '../models/OrgFeedback';

export type CreateOrgFeedbackDto = Pick<OrgFeedback, 'description'>;
