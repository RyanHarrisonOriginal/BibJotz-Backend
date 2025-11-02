import { Church } from "./church";

export class ChurchMapper {

    public static mapChurchToDomain(prismaChurch: any): Church {
        return new Church(
            prismaChurch.id,
            prismaChurch.name,
            prismaChurch.street,
            prismaChurch.city,
            prismaChurch.state,
            prismaChurch.zip,
        );
    }

    public static mapChurchToPersistence(church: Church): any {
        return {
            id: church.getId(),
            name: church.getName(),
            street: church.getAddress().getStreet(),
            city: church.getAddress().getCity(),
            state: church.getAddress().getState(),
            zip: church.getAddress().getZip(),
        };
    }
}