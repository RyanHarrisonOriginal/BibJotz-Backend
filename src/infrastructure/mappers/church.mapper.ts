import { Church } from "@/domain/Church/church";
import { Address } from "@/domain/shared/value-objects/Address";
import { URL } from "@/domain/shared/value-objects/URL";
import { Email } from "@/domain/shared/value-objects/Email";

export class ChurchMapper {
    public static mapToDomain(prismaChurch: any): Church {
        return new Church(
            prismaChurch.id,
            prismaChurch.name,
            Address.create(prismaChurch.street, prismaChurch.city, prismaChurch.state, prismaChurch.zip),
            URL.create(prismaChurch.website),
            Email.create(prismaChurch.email),
            prismaChurch.phone,
        );
    }
}