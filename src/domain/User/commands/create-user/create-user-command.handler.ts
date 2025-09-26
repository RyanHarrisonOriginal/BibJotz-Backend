import { IUserRepository } from "@/domain/User/user-repository.interface";
import { CreateUserCommand } from "./create-user.command";
import { User } from "@/domain/User/user";
import { UserFactory } from "@/domain/User/user-factory";
import { ICommandHandler } from "@/domain/shared/interfaces/command-handler.interface";

export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand, User> {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(command: CreateUserCommand): Promise<User> {
        const user = UserFactory.create({
            id: null,
            email: command.email,
            username: command.username,
            firstName: command.firstName,
            lastName: command.lastName,
            primaryChurchId: command.primaryChurchId,
            isPublic: command.isPublic,
            journeySubscriptions: [],
            guideSubscriptions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }
}
