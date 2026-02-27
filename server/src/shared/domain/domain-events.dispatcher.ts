import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { DomainEvent } from '@shared/domain/domain-event';

@Injectable()
export class DomainEventsDispatcher {
  constructor(private readonly eventBus: EventBus) {}

  publish(events: DomainEvent[]) {
    for (const event of events) {
      this.eventBus.publish(event);
    }
  }
}
