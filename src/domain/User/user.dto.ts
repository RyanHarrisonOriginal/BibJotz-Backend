export interface IUserDTO {
    id: number | null;
    email: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    firstName: string;
    lastName: string;
    primaryChurchId: number | null;
}
