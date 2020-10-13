import { Publisher, Subjects, TicketCreatedEvent } from '@fldevtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
