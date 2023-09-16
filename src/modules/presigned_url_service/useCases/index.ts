import { CreateSupplierQuoteAttachmentUrlUseCase } from './interfaces/CreateSupplierQuoteAttachmentUrlUseCase';
import CreateSupplierQuoteAttachmentUrlUseCaseImpl from './CreateSupplierQuoteAttachmentUrlUseCaseImpl';

interface UseCases {
  createSupplierQuoteAttachmentUrlUseCase: CreateSupplierQuoteAttachmentUrlUseCase,
}

const useCases: UseCases = {
  createSupplierQuoteAttachmentUrlUseCase: new CreateSupplierQuoteAttachmentUrlUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  createSupplierQuoteAttachmentUrlUseCase,
} = useCases;
