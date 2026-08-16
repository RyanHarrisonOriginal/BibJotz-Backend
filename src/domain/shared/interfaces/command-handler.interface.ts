import { ICommand } from './command.interface';

export interface ICommandHandler<TCommand extends ICommand, TResult = unknown> {
  execute(command: TCommand): Promise<TResult>;
}
