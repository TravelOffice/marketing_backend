/// FILE BASED MODELS ///
export interface FileBase {
  file_id: string;
  file_size?: number;
}

export interface File extends FileBase {
  file_path?: string;
}

export interface PhotoSize extends FileBase {
  width: number;
  height: number;
}

export interface Audio extends FileBase {
  duration: number;
  performer?: string;
  title?: string;
  mime_type?: string;
  thumb?: PhotoSize;
}

export interface Document extends FileBase {
  thumb?: PhotoSize;
  file_name?: string;
  mime_type?: string;
}

export interface Animation extends FileBase {
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  file_name?: string;
  mime_type?: string;
}

export interface Video extends FileBase {
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  mime_type?: string;
}

export interface Voice extends FileBase {
  duration: number;
  mime_type?: string;
}

export interface VideoNote extends FileBase {
  length: number;
  duration: number;
  thumb?: PhotoSize;
}
