import { File } from '../telegram-message-platform';
import { BaseDdbModel } from './BaseDdbModel';

export type ChatPlatformFile = File;

export interface DDBFile extends BaseDdbModel {
  fileInfo: ChatPlatformFile,
}
