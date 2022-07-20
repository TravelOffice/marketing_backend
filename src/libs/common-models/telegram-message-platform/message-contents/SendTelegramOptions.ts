/* eslint-disable @typescript-eslint/no-unused-vars */
type ParseMode = 'Markdown' | 'MarkdownV2' | 'HTML';

interface SendBasicOptions {
    disable_notification?: boolean;
    reply_to_message_id?: number;
    protect_content?: boolean;
}

export interface FileOptions {
    filename?: string;
    contentType?: string;
}

export interface SendMessageOptions extends SendBasicOptions {
    parse_mode?: ParseMode;
    disable_web_page_preview?: boolean;
}

export interface SendPhotoOptions extends SendBasicOptions {
    parse_mode?: ParseMode;
    caption?: string;
}

export interface SendDocumentOptions extends SendBasicOptions {
    parse_mode?: ParseMode;
    thumb?: string,
    caption?: string;
}

export interface SendMessageData {
    text?: string,
    photo?: string,
    doc?: string,
    options?: SendMessageOptions | SendPhotoOptions | SendDocumentOptions,
    fileOptions?: FileOptions,
}
