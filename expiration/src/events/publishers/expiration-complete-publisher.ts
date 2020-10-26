import { Subjects, Publisher, ExpirationCompleteEvent } from '@fldevtickets/common';

export class ExperiationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject =  Subjects.ExpirationComplete 
}
