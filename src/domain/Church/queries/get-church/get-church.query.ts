import { IQuery } from "@/domain/shared/interfaces/query.interface";

export class GetChurchQuery implements IQuery {
    readonly queryType = 'GetChurchQuery';

    constructor(
        public readonly id?: number,
        public readonly name?: string,
        public readonly city?: string,
        public readonly state?: string,
        public readonly zip?: string
    ) {}
}
