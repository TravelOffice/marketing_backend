import { Employee } from '../../models/Employee';

export interface UpdateEmployeeUseCase {
  invoke: (id: string | number, employee: Employee) => Promise<Employee>;
}
