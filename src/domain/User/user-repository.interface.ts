import { User } from "./user";

export interface IUserRepository {
    save(user: User): Promise<User>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findAllSubscribedToGuide(guideId: number): Promise<User[]>;
    findAllSubscribedToJourney(journeyId: number): Promise<User[]>;
    exists(email: string, username: string): Promise<boolean>;
    }