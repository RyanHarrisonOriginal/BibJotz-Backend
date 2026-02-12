import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IUpsertReflectionRequestDTO } from "@/domain/Reflection/reflection.dto";

export class UpsertReflectionCommand implements ICommand {
    readonly commandType = 'UpsertReflectionCommand';

    constructor(
        public readonly entryKey: string,
        public readonly journeyId: number,
        public readonly guideSectionId: number,
        public readonly authorId: number,
        public readonly content: string,
    ) {}

    static from(dto: IUpsertReflectionRequestDTO): UpsertReflectionCommand {
        const entryKey = dto.entry_key?.trim();
        if (!entryKey) {
            throw new Error('entry_key is required');
        }
        const journeyId = parseInt(String(dto.journey_id), 10);
        const guideSectionId = parseInt(String(dto.guide_section_id), 10);
        if (Number.isNaN(journeyId) || journeyId <= 0) {
            throw new Error('Valid journey_id is required');
        }
        if (Number.isNaN(guideSectionId) || guideSectionId <= 0) {
            throw new Error('Valid guide_section_id is required');
        }
        return new UpsertReflectionCommand(
            entryKey,
            journeyId,
            guideSectionId,
            dto.author_id,
            dto.content ?? '',
        );
    }
}
