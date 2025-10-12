import { User } from '@/domain/User/user';
import { Email } from '@/domain/shared/value-objects/Email';
import { Subscription } from '@/domain/shared/value-objects/Subscription';
import { PrismaClient } from '@prisma/client';

/**
 * Database entity interface for User
 * Represents the persistence layer structure
 */
export interface IUserEntity {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Mapper for converting between User domain objects and persistence entities
 * Handles the transformation between domain model and database schema
 */
export class UserMapper {

  public static mapToDomain(prismaUser: any): User {
    const journeySubscriptions = prismaUser.journeySubscriptions?.map((sub: any) =>
        Subscription.create(sub.userId, sub.journeyId, 'journey', sub.subscribedAt)
    ) || [];

    const guideSubscriptions = prismaUser.guideSubscriptions?.map((sub: any) =>
        Subscription.create(sub.userId, sub.guideId, 'guide', sub.subscribedAt)
    ) || [];

    return new User(
        prismaUser.id,
        Email.create(prismaUser.email),
        prismaUser.username,
        prismaUser.isPublic,
        prismaUser.firstName,
        prismaUser.lastName,
        prismaUser.churchId,
        journeySubscriptions,
        guideSubscriptions,
        prismaUser.createdAt,
        prismaUser.updatedAt
    );
  }
  

  /**
   * Maps an array of database entities to User domain objects
   * @param entities Array of database entities
   * @returns Array of User domain objects
   */
  public static mapToDomainArray(entities: any[]): User[] {
    return entities.map(entity => this.mapToDomain(entity));
  }

}
