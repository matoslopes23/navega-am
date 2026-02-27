export type DomainEvent = {
  name: string;
  occurredOn: Date;
  payload?: Record<string, unknown>;
};
