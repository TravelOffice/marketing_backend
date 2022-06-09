export interface DeleteEmployeeUseCase {
  invoke: (id: string | number) => Promise<void>;
}
