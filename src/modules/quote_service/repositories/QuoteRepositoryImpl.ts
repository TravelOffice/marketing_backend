import { Quote } from '../models/Quote';
import { QuoteRepository } from './interfaces/QuoteRepository';

export default class QuoteRepositoryImpl implements QuoteRepository {
  list = async () => {
    throw new Error('Method not implemented!');
  };

  get = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };

  create = async (quote: Quote) => {
    console.log(quote);
    throw new Error('Method not implemented!');
  };

  update = async (id: string | number, quote: Quote) => {
    console.log(id, quote);
    throw new Error('Method not implemented!');
  };

  delete = async (id: string | number) => {
    console.log(id);
    throw new Error('Method not implemented!');
  };
}
