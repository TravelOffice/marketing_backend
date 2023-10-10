export enum NoteTypeEnum {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  ZALO = 'ZALO',
  OTHERS = 'OTHERS',
}

export interface Note {
  id: string,
  title: string,
  description: string,
  type: NoteTypeEnum,
  createdAt: number,
  updatedAt: number,
  creatorId: string,
  creatorName: string,
}
