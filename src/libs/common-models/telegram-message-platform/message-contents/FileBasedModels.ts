/// FILE BASED MODELS ///
export interface FileBase {
  file_id: string;
  file_size?: number | undefined;
}

export interface PhotoSize extends FileBase {
  width: number;
  height: number;
}

export interface Audio extends FileBase {
  duration: number;
  performer?: string | undefined;
  title?: string | undefined;
  mime_type?: string | undefined;
  thumb?: PhotoSize | undefined;
}

export interface Document extends FileBase {
  thumb?: PhotoSize | undefined;
  file_name?: string | undefined;
  mime_type?: string | undefined;
}

export interface Animation extends FileBase {
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize | undefined;
  file_name?: string | undefined;
  mime_type?: string | undefined;
}

export interface Video extends FileBase {
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize | undefined;
  mime_type?: string | undefined;
}

export interface Voice extends FileBase {
  duration: number;
  mime_type?: string | undefined;
}

export interface VideoNote extends FileBase {
  length: number;
  duration: number;
  thumb?: PhotoSize | undefined;
}
