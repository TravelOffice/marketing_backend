import { employeeRepository } from '../repositories';
import { DeleteEmployeeUseCase } from './interfaces/DeleteEmployeeUseCase';

export default class DeleteEmployeeUseCaseImpl implements DeleteEmployeeUseCase {
  invoke = async (id: string | number) => employeeRepository.delete(id);
}
