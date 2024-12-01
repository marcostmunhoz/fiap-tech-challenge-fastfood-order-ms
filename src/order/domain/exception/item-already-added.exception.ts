import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class ItemAlreadyAddedException extends DomainException {
  constructor() {
    super('Item already exists in the order.');
  }
}
