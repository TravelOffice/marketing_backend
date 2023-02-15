export const UNKNOWN_USER = 'unknown';

export const EVENT_RECEIVED = 'EVENT_RECEIVED';

export const TENANT_INDEX = 'TENANT';

export const PAGE_INDEX = 'PAGE';

export const ASSIGNEE_INDEX = 'ASSIGNEE';

export const CONVERSATION_INDEX = 'CONVERSATION';

export const TEMPORARY_MESSAGE_INDEX = 'TEMPORARY_MESSAGE';

export const PARTITION_KEY_DELIMITER = '#';

export const MESSAGE_INDEX = 'MESSAGE';

export const userSendDataEvents = [
  'user_send_image',
  'user_send_link',
  'user_send_text',
  'user_send_sticker',
  'user_send_gif',
  'user_send_audio',
  'user_send_video',
  'user_send_file',
  'user_send_location',
];

export const anonymousSendDataEvents = [
  'anonymous_send_text',
  'anonymous_send_image',
  'anonymous_send_file',
  'anonymous_send_sticker',
];

export const oaSendDataEvents = [
  'oa_send_text',
  'oa_send_image',
  'oa_send_list',
  'oa_send_gif',
  'oa_send_file',
  'oa_send_sticker',
  'oa_send_anonymous_text',
  'oa_send_anonymous_image',
  'oa_send_anonymous_file',
  'oa_send_anonymous_sticker',
];

export const sendDataEvents = [
  ...userSendDataEvents,
  ...anonymousSendDataEvents,
  ...oaSendDataEvents,
];

export const sendTextEvents = [
  'user_send_text',
  'anonymous_send_text',
  'oa_send_text',
  'oa_send_anonymous_text',
];

export const sendLinkEvents = [
  'user_send_link',
];

export const sendFileEvents = [
  'user_send_file',
  'anonymous_send_file',
  'oa_send_file',
  'oa_send_anonymous_file',
];

export const sendMediaEvents = [
  'user_send_image',
  'user_send_gif',
  'user_send_audio',
  'user_send_video',
  'anonymous_send_image',
  'oa_send_image',
  'oa_send_gif',
  'oa_send_anonymous_image',
];
