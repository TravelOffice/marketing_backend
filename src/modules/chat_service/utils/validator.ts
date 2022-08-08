import { ChatPlatform } from 'common-models';
import { Request } from 'express';
import {
  body,
  ValidationError,
  validationResult,
} from 'express-validator';
import { VALIDATE_NON_EMPTY_STRING_MSG } from './constants';

export default function validate(req: Request) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorGroups: { [key: string]: ValidationError[] } = {};
    errors.array().forEach((err) => {
      const location = err.location || 'unknown';
      const errs: ValidationError[] = errorGroups[location] || [];
      errs.push(err);
      errorGroups[location] = errs;
    });
    const msgs = Object.entries(errorGroups)
      .map((entry) => `Validate failed at ${entry[0]}: ${entry[1].map((err) => `${err.param} ${err.msg}, value=${err.value}`).join('; ')}`);
    throw new Error(msgs.join('\n'));
  }
}
/**
 * Validate params for manual assign chat function
 * @returns Array of results
 */
export function manualAssignChatValidator() {
  return [
    body('chatPlatform')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG)
      .isIn(Object.values(ChatPlatform))
      .withMessage(`allow only in ${Object.values(ChatPlatform)}`),

    body('conversationId')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('pageId')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),

    body('assignee')
      .notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
  ];
}
