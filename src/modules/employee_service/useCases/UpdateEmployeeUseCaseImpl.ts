import { Employee } from '../models/Employee';
import { employeeRepository } from '../repositories';
import { UpdateEmployeeUseCase } from './interfaces/UpdateEmployeeUseCase';

export default class UpdateEmployeeUseCaseImpl implements UpdateEmployeeUseCase {
  invoke = (id: string | number, employee: Employee) => employeeRepository.update(id, employee);
}
