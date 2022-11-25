export interface ZaloMessageResponsePayload {
  data: any;
  paging: {
    cursors: {
      before: string,
      after: string
    }
  };
}
