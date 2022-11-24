export const SUCCESS = 'Successfully!';

export const FAILED = 'Failed!';

export const TENANT_INDEX = 'TENANT';

export const LEAD_INDEX = 'LEAD';

export const OPPORTUNITY_INDEX = 'OPPORTUNITY';

export const EMPLOYEE_INDEX = 'EMPLOYEE';

export const PAGE_INDEX = 'PAGE';

export const ZALO_CODE_VERIFIER_INDEX = 'ZALO#CodeVerifier';

export const TELEGRAM_SECRET_CODE_LENGTH = 50;

export const TELEGRAM_WEBHOOK_MAX_CONNECTION = 100;

export const TELEGRAM_WEBHOOK_ALLOWED_UPDATES = ['message'];

export const TELEGRAM_WEBHOOK_DROP_PENDING_UPDATES = true;

export const ZALO_CODE_VERIFIER_TTL = 5 * 60000; // Will be delete from database after 5 minutes

export const ZALO_REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60000; // Expire after 30 days
