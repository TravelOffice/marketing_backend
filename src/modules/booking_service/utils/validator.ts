import { Request } from 'express';
import { body, ValidationError, validationResult } from 'express-validator';
import { bookingPaymentStatuses, tourTypes } from '../models/booking/Booking';
import {
  VALIDATE_ARRAY_MSG,
  VALIDATE_DATE_MSG,
  VALIDATE_NON_EMPTY_STRING_MSG,
  VALIDATE_PHONE_ARRAY_MSG,
  VALIDATE_PHONE_MSG,
  VALIDATE_POSITIVE_NUMBER,
  VALIDATE_STRING_ARRAY_MSG,
  VALIDATE_STRING_MSG,
  VALIDATE_URL_MSG,
} from './constants';
import {
  CustomerLevel, HonorificType, MaritalStatus, SexType,
} from '../models/Customer';

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
    body('sourceId').notEmpty().isString(),
    body('tourType').notEmpty().isIn(tourTypes).withMessage(`allow only in ${tourTypes}`),
    body('departureDate').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }),
    body('assigneeId').notEmpty().isString(),
    body('customer').isObject().withMessage('Customer information must not be empty'),
    body('customer.email').notEmpty().isEmail(),
    body('customer.primaryPhoneNumber').notEmpty().isMobilePhone('any'),
    body('customer.honorific').optional().isString(),
    body('customer.name').optional().isString(),
    body('customer.address').optional().isString(),
    body('services').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('services.*.serviceName').notEmpty().isString(),
    body('services.*.quantity', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('services.*.price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('services.*.tax', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('passengers').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('passengers.*.honorific').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.name').notEmpty().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.email').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.phoneNumber').optional().isMobilePhone('any'),
    body('passengers.*.address').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.sex').optional().isIn(Object.values(SexType)).withMessage(`property allow only in ${Object.values(SexType)}`),
    body('passengers.*.attachedDoc').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('passengers.*.birthday', VALIDATE_DATE_MSG).optional()
      .if(body('passengers.*.birthday'))
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),
  ];
}

export function validateNewBookingFromLeadParams() {
  return [
    body('leadId').notEmpty().isString(),
    body('tourTemplateId').notEmpty().isString(),
    body('tourType').notEmpty().isIn(tourTypes).withMessage(`allow only in ${tourTypes}`),
    body('departureDate').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    }),
    body('note').optional().isString(),
    body('services').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('services.*.serviceName').notEmpty().isString(),
    body('services.*.quantity', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('services.*.price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('services.*.tax', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
  ];
}

export function validateCancelBookingDataInput() {
  return [
    body('reason', VALIDATE_NON_EMPTY_STRING_MSG).notEmpty().isString(),
  ];
}

export function validatePaymentPendingInput() {
  return [
    body('waitingExpiredAt').optional().custom((value: string) => {
      const date = Date.parse(value);
      return !Number.isNaN(date);
    })];
}

export function validateGetBookingFilteredParams() {
  // TODO: Implement validator for filtered parameters
  // such as start date, end date, customerId, etc
  return [];
}

export function validateUpdateBookingParams() {
  return [
    body('tourTemplateId').optional().notEmpty().isString(),
    body('sourceId').optional().notEmpty().isString(),
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
    body('tourType').optional().notEmpty().isIn(tourTypes)
      .withMessage(`allow only in ${tourTypes}`),
    body('paymentStatus').optional().notEmpty().isIn(bookingPaymentStatuses)
      .withMessage(`allow only in ${bookingPaymentStatuses}`),
    body('assigneeId').optional().notEmpty().isString(),
    /**
     * TODO: Temporary attributes
     * These attrs will be updated later
     */
    body('requestedCode').optional().isString(),
    body('bookingCode').optional().isString(),
    body('labelId').optional().isString(),
    body('sourceId').optional().isString(),
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
    body('doneAt').optional().isNumeric(),
    body('totalPax').optional().isNumeric(),
    body('services').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('services.*.serviceName').notEmpty().isString(),
    body('services.*.quantity', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('services.*.price', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('services.*.tax', VALIDATE_POSITIVE_NUMBER)
      .notEmpty()
      .isInt({ min: 0 }),
    body('departureTourId').optional()
      .notEmpty()
      .withMessage(VALIDATE_NON_EMPTY_STRING_MSG)
      .isString()
      .withMessage(VALIDATE_STRING_MSG),
    body('passengers').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('passengers.*.honorific').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.name').notEmpty().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.email').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.phoneNumber').optional().isMobilePhone('any'),
    body('passengers.*.address').optional().isString().withMessage(VALIDATE_STRING_MSG),
    body('passengers.*.attachedDoc').optional().isArray().withMessage(VALIDATE_ARRAY_MSG),
    body('passengers.*.sex').optional().isIn(Object.values(SexType)).withMessage(`property allow only in ${Object.values(SexType)}`),
    body('passengers.*.birthday', VALIDATE_DATE_MSG).optional()
      .if(body('passengers.*.birthday'))
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),
    body('paidAmount').optional().isInt({ min: 0 }).withMessage(VALIDATE_POSITIVE_NUMBER),
  ];
}

export function validateSendEmailToTourGuideParams() {
  const emailAddressPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return [
    body('toAddresses').isArray().withMessage('toAddresses must be an array')
      .custom((value: Array<string>) => {
        if (!Array.isArray(value)) return false;
        return value.every((item: string) => item.toString().match(emailAddressPattern));
      })
      .withMessage('all elements of toAddresses must be email address'),
    body('ccAddresses').isArray().withMessage('ccAddresses must be an array')
      .custom((value: Array<string>) => {
        if (!Array.isArray(value)) return false;
        return value.every((item: string) => item.toString().match(emailAddressPattern));
      })
      .withMessage('all elements of ccAddresses must be email address'),
    body('subject').notEmpty().withMessage(VALIDATE_NON_EMPTY_STRING_MSG).isString()
      .withMessage(VALIDATE_STRING_MSG),
    body('html', VALIDATE_STRING_MSG).optional().isString(),
    body('text', VALIDATE_STRING_MSG).optional().isString(),
  ];
}

export function confirmBookingValidator() {
  return [
    body('departureTourId').notEmpty().isString().withMessage(VALIDATE_NON_EMPTY_STRING_MSG),
    body('paidAmount').notEmpty().isInt({ min: 0 }).withMessage(VALIDATE_POSITIVE_NUMBER),
  ];
}

export function addNoteValidator() {
  return [
    body('title').notEmpty().isString(),
    body('description').notEmpty().isString(),
    body('type').notEmpty().isString(),
  ];
}

export function updateNoteValidator() {
  return [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('type').optional().isString(),
  ];
}

export function validateUpdateBookingCustomerParams() {
  return [
    body('name', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('name').notEmpty())
      .isString(),

    body('honorific')
      .if(body('honorific').notEmpty())
      .isIn(Object.values(HonorificType)).withMessage(`property allow only in ${Object.values(HonorificType)}`),

    body('birthday', VALIDATE_DATE_MSG)
      .if(body('birthday').notEmpty())
      .custom((value: string) => {
        const date = Date.parse(value);
        return !Number.isNaN(date);
      }),

    body('sex')
      .if(body('sex').notEmpty())
      .isIn(Object.values(SexType)).withMessage(`property allow only in ${Object.values(SexType)}`),

    body('maritalStatus')
      .if(body('maritalStatus').notEmpty())
      .isIn(Object.values(MaritalStatus)).withMessage(`property allow only in ${Object.values(MaritalStatus)}`),

    body('primaryPhoneNumber', VALIDATE_PHONE_MSG)
      .if(body('primaryPhoneNumber').notEmpty())
      .custom((value: string) => {
        const regex = /^(0)(\d){9,10}$/;
        return value.match(regex);
      }),

    body('otherPhoneNumbers', VALIDATE_PHONE_ARRAY_MSG)
      .if(body('otherPhoneNumbers').notEmpty())
      .custom((value: Array<string>) => {
        if (!Array.isArray(value)) return false;
        const regex = /^(0)(\d){9,10}$/;
        return value.every((item: string) => item.toString().match(regex));
      }),

    body('email', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('email').notEmpty())
      .isEmail(),

    body('address', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('address').notEmpty())
      .isString(),

    body('tags', VALIDATE_STRING_ARRAY_MSG)
      .if(body('tags').notEmpty())
      .custom((value: Array<string>) => {
        if (!Array.isArray(value)) return false;
        return value.every((item: string) => typeof item === 'string' && item.length > 0);
      }),

    body('sourceId', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('sourceId').notEmpty())
      .isString(),

    body('assigneeId', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('assigneeId').notEmpty())
      .isString(),

    body('interest', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('interest').notEmpty())
      .isString(),

    body('group', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('group').notEmpty())
      .isString(),

    body('genitive', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('genitive').notEmpty())
      .isString(),

    body('taxCode', VALIDATE_NON_EMPTY_STRING_MSG)
      .if(body('taxCode').notEmpty())
      .isString(),

    body('level')
      .if(body('level').notEmpty())
      .isIn(Object.values(CustomerLevel)).withMessage(`property allow only in ${Object.values(CustomerLevel)}`),

    body('socialLink', VALIDATE_URL_MSG)
      .if(body('socialLink').notEmpty())
      .isURL(),
  ];
}
