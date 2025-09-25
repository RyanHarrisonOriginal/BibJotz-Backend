import { ICommand } from "@/domain/shared/interfaces/command.interface";

export class CreateChurchCommand implements ICommand {
    readonly commandType = 'CreateChurchCommand';

    constructor(
        public readonly name: string,
        public readonly street: string,
        public readonly city: string,
        public readonly state: string,
        public readonly zip: string,
        public readonly website: string,
        public readonly email: string,
        public readonly phone: string,
    ) {}
}