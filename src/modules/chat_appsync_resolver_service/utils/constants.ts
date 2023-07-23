export const TENANT_INDEX = 'TENANT';

export const EMPLOYEE_INDEX = 'EMPLOYEE';

export const CONVERSATION_INDEX = 'CONVERSATION';

export const MESSAGE_INDEX = 'MESSAGE';

export const ASSIGNEE_INDEX = 'ASSIGNEE';

export const PARTITION_KEY_DELIMITER = '#';

// The order of events must be follow ChatPlatform
export const VALIDATION_EVENTS = ['allZaloMessages', 'allFbMessages', 'allTelegramMessages'];

export const UPDATE_SET_EXPRESSION = 'SET';

export const ROLE_INDEX = 'ROLE';

export const PERMISSION_INDEX = 'PERMISSION';

export const DEFAULT_ROLES = ['ROOT', 'ADMIN', 'SALE', 'OPERATOR', 'OPERATOR_MANAGER'];

export const OMITTED_CONVERSATION_ATTRIBUTES = ['pk', 'sk', 'lsi1', 'lsi2', 'lsi3', 'lsi4', 'lsi5'];
