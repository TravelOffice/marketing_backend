export interface FacebookMessageResponsePayload {
  data: any;
  paging: {
    cursors: {
      before: string,
      after: string
    }
  };
}
