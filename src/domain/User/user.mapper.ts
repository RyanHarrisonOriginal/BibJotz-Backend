import { User } from "./user";
import { Email } from "../shared/value-objects/Email";
import { Subscription } from "../shared/value-objects/Subscription";


export class UserMapper {

    private static arrayMapper<T>(array: any[], mapper: (item: any) => T): T[] {
        if (!array) {
            return [];
        }
        return array.map((item: any) => mapper(item));
    }

    public static mapUserToDomain(prismaUser: any): User {

        const journeySubscriptions = UserMapper.arrayMapper(
            prismaUser.journeySubscriptions, 
            (sub: any) => Subscription.create(prismaUser.id, sub.journeyId, 'journey', sub.subscribedAt)
        );
        const guideSubscriptions = UserMapper.arrayMapper(
            prismaUser.guideSubscriptions, 
            (sub: any) => Subscription.create(prismaUser.id, sub.guideId, 'guide', sub.subscribedAt)
        );

        
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
            prismaUser.updatedAt,
        );
    }

    public static mapUserToPersistence(user: User): any {
        return {
            id: user.getId(),
            email: user.getEmail().getValue(),
            username: user.getUsername(),
            isPublic: user.getIsPublic(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            churchId: user.getPrimaryChurchId(),
        };
    }
}