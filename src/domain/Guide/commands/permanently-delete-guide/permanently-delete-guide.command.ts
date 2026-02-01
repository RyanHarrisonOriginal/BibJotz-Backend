import { ICommand } from "@/domain/shared/interfaces/command.interface";
import { IDeleteGuideRequestDTO } from "@/domain/Guide/guide.dto";

function parseId(v: string | undefined): number {
    if (v == null || v === "") return 0;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
}

export class PermanentlyDeleteGuideCommand implements ICommand {
    readonly commandType = 'PermanentlyDeleteGuideCommand';

    constructor(
        public readonly guideId: number,
        public readonly userId: number,
    ) {}

    static from(dto: IDeleteGuideRequestDTO): PermanentlyDeleteGuideCommand {
        return new PermanentlyDeleteGuideCommand(parseId(dto.guideId), dto.userId);
    }
}