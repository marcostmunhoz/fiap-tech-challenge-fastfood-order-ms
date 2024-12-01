import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class OrderCanNotBeEditedException extends DomainException {
  constructor() {
    super('Only pending orders can be edited.');
  }
}
