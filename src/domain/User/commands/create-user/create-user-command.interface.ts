export interface ICreateUserCommand {
    email: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    firstName?: string;
    lastName?: string;
}
    