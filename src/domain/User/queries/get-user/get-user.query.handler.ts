import { User } from "@/domain/User/user";
import { IUserRepository } from "@/domain/User/user-repository.interface";
import { GetUserQuery } from "@/domain/User/queries/get-user/get-user.query";

export class GetUserQueryHandler {

    constructor(private readonly userRepository: IUserRepository) {}

    async execute(query: GetUserQuery): Promise<User> {
        const user = await this.userRepository.findById(query.userId);
        return user;
    }
}