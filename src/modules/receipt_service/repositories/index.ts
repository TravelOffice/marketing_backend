// TODO: Declare repository objects which can be used in this service here

import ReceiptRepositoryImpl from './ReceiptRepositoryImpl';
import { ReceiptRepository } from './interfaces/ReceiptRepository';

interface Repositories {
  receiptRepository: ReceiptRepository,
}

const repositories: Repositories = {
  receiptRepository: new ReceiptRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  receiptRepository,
} = repositories;
