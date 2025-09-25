import { BaseEntity } from "../BaseEntity";
import { Address } from "../shared/value-objects/Address";
import { Email } from "../shared/value-objects/Email";
import { URL } from "../shared/value-objects/URL";
import { PhoneNumber } from "../shared/value-objects/PhoneNumber";

export class Church extends BaseEntity {
    constructor(
        id: number | null,
        private name: string,
        private address: Address,
        private website?: URL,
        private email?: Email,
        private phone?: PhoneNumber,  
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        super(id ?? 0, createdAt, updatedAt);
    }

    getName(): string {
        return this.name;
    }

    getAddress(): Address {
        return this.address;
    }

    getWebsite(): URL | undefined {
        return this.website;
    }

    getEmail(): Email | undefined {
        return this.email;
    }

    getPhone(): PhoneNumber | undefined {
        return this.phone;
    }

    updateName(name: string) {
        this.name = name;
        this.touch();
    }

    updateAddress(address: Address) {
        this.address = address;
        this.touch();
    }

    updateWebsite(website: string) {
        this.website = URL.create(website);
        this.touch();
    }

    updateEmail(email: Email) {
        this.email = email;
        this.touch();
    }

    updatePhone(phone: string) {
        this.phone = PhoneNumber.create(phone);
        this.touch();
    }

 }