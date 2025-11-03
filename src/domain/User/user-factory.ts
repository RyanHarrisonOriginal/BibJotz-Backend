import { User } from "@/domain/User/user";
import { Email } from "@/domain/shared/value-objects/Email";
import { Subscription } from "@/domain/shared/value-objects/Subscription";

interface IUserCreationProps {
    id: number | null;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    isPublic: boolean;
    primaryChurchId: number;
    journeySubscriptions: Subscription[];
    guideSubscriptions: Subscription[];
    createdAt: Date;
    updatedAt: Date;
}

export class UserFactory {
    static create(data: IUserCreationProps): User {
        if (!data.firstName) {
            throw new Error('First name is required');
        }
        if (!data.lastName) {
            throw new Error('Last name is required');
        }

        return new User(
            0, 
            Email.create(data.email), 
            data.username, 
            data.isPublic, 
            data.firstName, 
            data.lastName, 
            data.primaryChurchId,
            data.journeySubscriptions,
            data.guideSubscriptions,
            new Date(), 
            new Date()
        );
    }
}
