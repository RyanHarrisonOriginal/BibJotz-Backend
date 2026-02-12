import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { ISaveReflectionRequestDTO } from "@/domain/Reflection/reflection.dto";

export class SaveReflectionCommand implements ICommand {
    readonly commandType = 'SaveReflectionCommand';

    constructor(
        public readonly reflectionId: number,
        public readonly content: string | undefined,
    ) {}

    static from(reflectionId: string | undefined, dto: ISaveReflectionRequestDTO): SaveReflectionCommand {
        const id = reflectionId != null ? parseInt(String(reflectionId), 10) : 0;
        if (Number.isNaN(id) || id <= 0) {
            throw new Error('Valid reflection ID is required');
        }
        return new SaveReflectionCommand(id, dto.content);
    }
}
