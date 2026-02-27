import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EchoHealthCommand } from '@modules/health/application/commands/echo-health.command';

@CommandHandler(EchoHealthCommand)
export class EchoHealthHandler implements ICommandHandler<EchoHealthCommand> {
  execute(command: EchoHealthCommand) {
    return Promise.resolve({ message: command.message });
  }
}
