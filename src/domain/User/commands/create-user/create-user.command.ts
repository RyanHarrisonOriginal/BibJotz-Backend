import { ICommand } from '@/domain/shared/interfaces/command.interface';
import { IUserDTO } from "@/domain/User/user.dto";

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

    static from(dto: IUserDTO): CreateUserCommand {
        const primaryChurchId = dto.primaryChurchId ?? 0;
        return new CreateUserCommand(
            dto.email,
            dto.username,
            dto.firstName,
            dto.lastName,
            typeof primaryChurchId === "number" ? primaryChurchId : 0,
            dto.isPublic,
        );
    }
}
