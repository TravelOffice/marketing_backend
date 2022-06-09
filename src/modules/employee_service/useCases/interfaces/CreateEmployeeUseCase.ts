import { Employee } from '../../models/Employee';

export interface CreateEmployeeUseCase {
  invoke: (employee: Employee) => Promise<Employee>;
}
