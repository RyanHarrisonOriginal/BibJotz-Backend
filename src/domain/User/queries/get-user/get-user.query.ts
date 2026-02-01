import { IQuery } from "@/domain/shared/interfaces/query.interface";
import { IGetUserParamsDTO } from "@/domain/User/user.dto";

export class GetUserQuery implements IQuery {
    public readonly userId: string;
    public readonly queryType = 'GetUserQuery';

    constructor(userId: string) {
        this.userId = userId;
    }

    /** Parse HTTP params DTO. Controllers call GetUserQuery.from(req.params). */
    static from(dto: IGetUserParamsDTO): GetUserQuery {
        return new GetUserQuery(dto.id ?? "");
    }
}
