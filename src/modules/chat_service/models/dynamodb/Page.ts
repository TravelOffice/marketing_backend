import { ChatPlatform } from 'common-models';

export interface Page {
    id: string,
    name: string,
    avatar?: string,
    platform: ChatPlatform,
}
