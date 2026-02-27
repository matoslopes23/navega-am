import { DomainEvent } from '@shared/domain/domain-event';

export abstract class BaseEntity<Props extends object> {
  private readonly domainEvents: DomainEvent[] = [];

  protected constructor(
    protected readonly props: Props,
    public readonly id: string,
  ) {}

  protected addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
