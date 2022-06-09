import { employeeRepository } from '../repositories';
import { GetEmployeeListUseCase } from './interfaces/GetEmployeeListUseCase';

export default class GetEmployeeListUseCaseImpl implements GetEmployeeListUseCase {
  invoke = async () => employeeRepository.list();
}
