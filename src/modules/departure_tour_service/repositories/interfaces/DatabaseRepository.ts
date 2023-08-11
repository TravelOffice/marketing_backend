export interface DatabaseRepository {
  executeBatchWrite: (requests: {
    PutRequest: { Item: any };
  }[]) => Promise<void>;
}
