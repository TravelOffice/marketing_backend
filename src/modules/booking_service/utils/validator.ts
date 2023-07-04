import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import { bookingPaymentStatuses, bookingStatuses, tourTypes } from '../models/booking/Booking';
import { VALIDATE_NON_EMPTY_STRING_MSG, VALIDATE_NUMBER_MSG, VALIDATE_POSITIVE_NUMBER } from './constants';

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

export function validateNewBookingParams() {
  return [
    body('tourTemplateId').notEmpty().isString(),
    body('tourType').notEmpty().isIn(tourTypes).withMessage(`allow only in ${tourTypes}`),
    body('departureDate').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }),
    body('assigneeId').notEmpty().isString(),
    body('customer').isObject().withMessage('Customer information must not be empty'),
    body('customer.email').notEmpty().isEmail(),
    body('customer.phone').notEmpty().isMobilePhone('any'),
    body('customer.honorific').optional().isString(),
    body('customer.fullName').optional().isString(),
    body('customer.address').optional().isString(),
  ];
}

export function validateNewBookingFromLeadParams() {
  return [
    body('leadId').notEmpty().isString(),
    body('tourTemplateId').notEmpty().isString(),
    body('tourType').notEmpty().isIn(tourTypes).withMessage(`allow only in ${tourTypes}`),
    body('departureDate').notEmpty().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }),
    body('note').optional().isString(),
    body('services').isArray().notEmpty().withMessage('Booking services must not be empty.'),
    body('services.*.serviceName').notEmpty().isString(),
    body('services.*.quantity', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),
    body('services.*.price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),
  ];
}

export function validateCancelBookingDataInput() {
  return [
    body('reason', VALIDATE_NON_EMPTY_STRING_MSG).notEmpty().isString(),
  ];
}

export function validateGetBookingFilteredParams() {
  // TODO: Implement validator for filtered parameters
  // such as start date, end date, customerId, etc
  return [];
}

export function validateUpdateBookingParams() {
  return [
    body('tourTemplateId').notEmpty().isString(),
    body('tourLeadId').optional().isString(),
    body('customerId').notEmpty().isString(),
    body('customer').isObject().withMessage('Customer information must not be empty'),
    body('customer.email').notEmpty().isEmail(),
    body('customer.phone').notEmpty().isMobilePhone('any'),
    body('customer.honorific').optional().isString(),
    body('customer.fullName').optional().isString(),
    body('customer.address').optional().isString(),
    body('notes').optional().isArray().withMessage('Notes must be array'),
    body('notes.*.title').if(body('notes').exists()).notEmpty().isString(),
    body('notes.*.description').if(body('notes').exists()).notEmpty().isString(),
    body('tasks').optional().isArray().withMessage('Tasks must be array'),
    body('tasks.*.title').if(body('tasks').exists()).notEmpty().isString(),
    body('tasks.*.description').if(body('tasks').exists()).notEmpty().isString(),
    body('tasks.*.dueDate')
      .if(body('tasks').exists()).notEmpty()
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),
    body('tourType').notEmpty().isIn(tourTypes).withMessage(`allow only in ${tourTypes}`),
    body('bookingStatus').notEmpty().isIn(bookingStatuses).withMessage(`allow only in ${bookingStatuses}`),
    body('paymentStatus').notEmpty().isIn(bookingPaymentStatuses).withMessage(`allow only in ${bookingPaymentStatuses}`),
    body('assigneeId').notEmpty().isString(),
    body('canceledAt').optional().isNumeric(),
    body('canceledReason').optional().isString(),
    body('canceledNote').optional().isString(),
    body('canceledBy').optional().isString(),
    body('canceledAtPhase').optional().isString(),
    /**
     * TODO: Temporary attributes
     * These attrs will be updated later
     */
    body('requestedCode').optional().isString(),
    body('bookingCode').optional().isString(),
    body('labelId').optional().isString(),
    body('sourceId').optional().isString(),
    body('creatorId').optional().isString(),
    body('creatorName').optional().isString(),
    body('requestStatus').optional().isString(),
    body('baseTotal').optional().isNumeric(),
    body('baseTotalAfterVAT').optional().isNumeric(),
    body('totalBonusSale').optional().isNumeric(),
    body('promoCode').optional().isString(),
    body('discountMoney').optional().isNumeric(),
    body('discountPercent').optional().isNumeric(),
    body('totalPayment').optional().isNumeric(),
    body('totalPaid').optional().isNumeric(),
    body('description').optional().isString(),
    body('checkin').optional().isNumeric(),
    body('checkout').optional().isNumeric(),
    body('bookingAt').optional().isNumeric(),
    body('waitingAt').optional().isNumeric(),
    body('waitingExpiredAt').optional().isNumeric(),
    body('doneAt').optional().isNumeric(),
    body('totalPax').optional().isNumeric(),
    body('services').isArray().notEmpty().withMessage('Booking services must not be empty.'),
    body('services.*.serviceName').notEmpty().isString(),
    body('services.*.quantity', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),
    body('services.*.price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .withMessage(VALIDATE_NUMBER_MSG)
      .isInt({ min: 0 }),
  ];
}
