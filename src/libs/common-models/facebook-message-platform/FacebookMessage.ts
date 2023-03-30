export interface FacebookAttachmentMessage {
  id: string,
  mime_type: string,
  name: string,
  size: number,
  file_url?: string,
  image_data?: {
    width: number,
    height: number,
    max_width: number,
    max_height: number,
    url: string,
    preview_url: string,
    image_type: number,
    render_as_sticker: boolean,
  },
  video_data?: {
    url: string,
    width: number,
    height: number,
  }
}

export interface FacebookMessage {
  id: string,
  created_time: string,
  from: {
    id: string,
    email: string,
    name: string,
  },
  message: string,
  to: {
    data: Array<{
      id: string,
      email: string,
      name: string,
    }>
  },
  attachments?: {
    data: Array<FacebookAttachmentMessage>
  },
  shares?: {
    data: Array<{
      id: string,
      link: string,
    }>
  }
}
