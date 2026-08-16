import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';

export class CommandBus {
  private handlers = new Map<string, ICommandHandler<ICommand, unknown>>();

  registerHandler<TCommand extends ICommand, TResult>(
    commandType: string,
    handler: ICommandHandler<TCommand, TResult>,
  ): void {
    this.handlers.set(commandType, handler as ICommandHandler<ICommand, unknown>);
  }

  async execute<TCommand extends ICommand, TResult>(command: TCommand): Promise<TResult> {
    const handler = this.handlers.get(command.commandType);
    if (!handler) {
      throw new Error(`No handler registered for command type: ${command.commandType}`);
    }
    return handler.execute(command) as Promise<TResult>;
  }
}
