import { BaseDdbModel } from 'common-models';

export interface OrgFeedback extends BaseDdbModel {
  code: string, // Auto-generated code from DynamoDB
  description?: string, // Description of the tour post
  organizationId: string, // The ID of the Organization
  authorId: string, // Alias id of marketplace user that is auto-generated or set by user
}
