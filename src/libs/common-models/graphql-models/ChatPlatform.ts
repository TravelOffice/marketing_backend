export enum ChatPlatform {
  zalo = 'zalo',
  facebook = 'facebook',
  telegram = 'telegram',
}

export type ChatPlatformStrings = keyof typeof ChatPlatform;
