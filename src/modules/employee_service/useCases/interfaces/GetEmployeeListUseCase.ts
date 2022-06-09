import { Employee } from '../../models/Employee';

export interface GetEmployeeListUseCase {
  invoke: () => Promise<Array<Employee>>;
}
