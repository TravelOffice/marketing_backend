import { Employee } from '../models/Employee';
import { EmployeeRepository } from './interfaces/EmployeeRepository';

export default class EmployeeRepositoryImpl implements EmployeeRepository {
  list = async () => {
    throw new Error('Method not implemented!');
  };

  get = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };

  create = async (employee: Employee) => {
    console.log(employee);
    throw new Error('Method not implemented!');
  };

  update = async (id: string | number, employee: Employee) => {
    console.log(id, employee);
    throw new Error('Method not implemented!');
  };

  delete = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };
}
