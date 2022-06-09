import { Employee } from '../../models/Employee';

export interface GetEmployeeUseCase {
  invoke: (id: string | number) => Promise<Employee>;
}
