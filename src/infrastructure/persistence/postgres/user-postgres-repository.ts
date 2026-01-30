import { IUserRepository } from "@/domain/User/user-repository.interface";
import { User } from "@/domain/User/user";
import { PrismaClient } from "@prisma/client";
import { Email } from "@/domain/shared/value-objects/Email";
import { Subscription } from "@/domain/shared/value-objects/Subscription";
import { UserFactory } from "@/domain/User/user-factory";
import { UserMapper } from "@/domain/User/user.mapper";

export class UserPostgresRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(user: User): Promise<any> {
        const userData = {
            email: user.getEmail().getValue(),
            username: user.getUsername(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            isPublic: user.getIsPublic(),
            primaryChurchId: user.getPrimaryChurchId(),
        };

        return await this.prisma.user.create({
            data: userData,
        });
    }

    async findById(id: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<any | null> {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findByUsername(username: string): Promise<any | null> {
        return await this.prisma.user.findUnique({
            where: { username },
        });
    }

    async findAllSubscribedToGuide(guideId: number): Promise<User[]> {
        throw new Error('Not implemented');
    }

    async findAllSubscribedToJourney(journeyId: number): Promise<User[]> {
        throw new Error('Not implemented');
    }

    async exists(email: string, username: string): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        return user !== null;
    }

    
}
