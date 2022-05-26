export interface DeleteQuoteUseCase {
  invoke: (id: string | number) => Promise<void>;
}
