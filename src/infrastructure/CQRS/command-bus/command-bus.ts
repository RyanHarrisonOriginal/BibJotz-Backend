import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';


export class CommandBus {
  private handlers = new Map<string, ICommandHandler<any, any>>();


  registerHandler<TCommand extends ICommand, TResult>(
    commandType: string,
    handler: ICommandHandler<TCommand, TResult>
  ): void {
    this.handlers.set(commandType, handler);
  }

  async execute<TCommand extends ICommand, TResult>(
    command: TCommand
  ): Promise<TResult> {
    const handler = this.handlers.get(command.commandType);
    
    if (!handler) {
      throw new Error(`No handler registered for command type: ${command.commandType}`);
    }

    try {
      return await handler.execute(command);
    } catch (error) {
      throw error;
    }
  }

  hasHandler(commandType: string): boolean {
    return this.handlers.has(commandType);
  }


  getRegisteredCommandTypes(): string[] {
    return Array.from(this.handlers.keys());
  }
}