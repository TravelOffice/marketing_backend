import { employeeRepository } from '../repositories';
import { GetEmployeeUseCase } from './interfaces/GetEmployeeUseCase';

export default class GetEmployeeUseCaseImpl implements GetEmployeeUseCase {
  invoke = (id: string | number) => employeeRepository.get(id);
}
