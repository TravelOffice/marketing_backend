export interface ZaloUploadFileResponsePayload {
  data: {
    token?: string,
    attachment_id?: string
  };
  error: number,
  message: string
}
