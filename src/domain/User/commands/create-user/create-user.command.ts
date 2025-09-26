import { ICommand } from '@/domain/shared/interfaces/command.interface';

export class CreateUserCommand implements ICommand {
    readonly commandType = 'CreateUserCommand';

    constructor(
        public readonly email: string,
        public readonly username: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly primaryChurchId: number,
        public readonly isPublic: boolean,
    ) {}
}
