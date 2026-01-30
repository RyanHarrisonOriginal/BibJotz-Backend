import { User } from "@/domain/User/user";
import { IUserRepository } from "@/domain/User/user-repository.interface";
import { GetUserQuery } from "@/domain/User/queries/get-user/get-user.query";
import { UserMapper } from "@/domain/User/user.mapper";

export class GetUserQueryHandler {

    constructor(private readonly userRepository: IUserRepository) {}

    async execute(query: GetUserQuery): Promise<User> {
        const userData = await this.userRepository.findById(query.userId);
        return UserMapper.mapUserToDomain(userData);
    }
}