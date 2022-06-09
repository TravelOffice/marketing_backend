import { Employee } from '../models/Employee';
import { employeeRepository } from '../repositories';
import { CreateEmployeeUseCase } from './interfaces/CreateEmployeeUseCase';

export default class CreateEmployeeUseCaseImpl implements CreateEmployeeUseCase {
  invoke = async (employee: Employee) => employeeRepository.create(employee);
}
