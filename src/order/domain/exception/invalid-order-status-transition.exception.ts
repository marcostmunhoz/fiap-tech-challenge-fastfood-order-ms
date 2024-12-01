import { DomainException } from '@marcostmunhoz/fastfood-libs';

export class InvalidOrderStatusTransitionException extends DomainException {
  constructor(oldStatus: string, newStatus: string) {
    super(`Invalid transition from ${oldStatus} to ${newStatus}.`);
  }
}
