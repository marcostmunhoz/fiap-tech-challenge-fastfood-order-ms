import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class ItemNotFoundException extends DomainException {
  constructor() {
    super('Item not found in the order.');
  }
}
