import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { ICreateDraftBodyDTO } from "@/domain/Drafts/draft.dto";

export class CreateDraftCommand implements ICommand {
    readonly commandType = 'CreateDraftCommand';

    constructor(
        public readonly userId: number,
        public readonly name: string,
        public readonly draftKey: string,
        public readonly draftContent: Record<string, unknown>,
    ) {}

    /** Parse HTTP body DTO. Controllers call CreateDraftCommand.from(req.body). */
    static from(dto: ICreateDraftBodyDTO): CreateDraftCommand {
        const userId = typeof dto.userId === "string" ? parseInt(dto.userId, 10) : (dto.userId ?? 0);
        return new CreateDraftCommand(
            Number.isNaN(userId) ? 0 : userId,
            dto.name ?? "",
            dto.draftKey ?? "",
            dto.draftContent ?? {},
        );
    }
}

