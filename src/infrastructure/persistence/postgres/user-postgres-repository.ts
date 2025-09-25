import { IUserRepository } from "@/domain/User/user-repository.interface";
import { User } from "@/domain/User/user";
import { PrismaClient } from "@prisma/client";
import { Email } from "@/domain/shared/value-objects/Email";
import { Subscription } from "@/domain/shared/value-objects/Subscription";
import { UserFactory } from "@/domain/User/user-factory";
import { UserMapper } from "../../mappers/user.mapper";

export class UserPostgresRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(user: User): Promise<User> {
        const userData = {
            email: user.getEmail().getValue(),
            username: user.getUsername(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            isPublic: user.getIsPublic(),
            primaryChurchId: user.getPrimaryChurchId(),
        };

        const savedUser = await this.prisma.user.create({
            data: userData,
        });

        return UserMapper.mapToDomain(savedUser);
    }

    async findById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },

        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        return UserMapper.mapToDomain(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },

        });

        return user ? UserMapper.mapToDomain(user) : null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { username },

        });

        return user ? UserMapper.mapToDomain(user) : null;
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
