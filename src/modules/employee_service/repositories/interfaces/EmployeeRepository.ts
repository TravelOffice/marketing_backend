import { Employee } from '../../models/Employee';

export interface EmployeeRepository {
  list: () => Promise<Array<Employee>>
  create: (employee: Employee) => Promise<Employee>
  get: (id: string | number) => Promise<Employee>
  update: (id: string | number, employee: Employee) => Promise<Employee>
  delete: (id: string | number) => Promise<void>
}
