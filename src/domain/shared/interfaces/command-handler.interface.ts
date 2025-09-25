import { ICommand } from './command.interface'; 

export interface ICommandHandler<CommandType extends ICommand, ResultType = any> {
  execute(command: CommandType): Promise<ResultType>;
}

