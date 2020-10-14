import { Publisher, Subjects, TicketUpdatedEvent } from '@fldevtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
