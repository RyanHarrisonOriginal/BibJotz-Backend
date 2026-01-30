import { User } from "@/domain/User/user";

export interface IUserRepository {
    save(user: User): Promise<any>;
    findById(id: number): Promise<any>;
    findByEmail(email: string): Promise<any | null>;
    findByUsername(username: string): Promise<any | null>;
    findAllSubscribedToGuide(guideId: number): Promise<any[]>;
    findAllSubscribedToJourney(journeyId: number): Promise<any[]>;
    exists(email: string, username: string): Promise<boolean>;
    }