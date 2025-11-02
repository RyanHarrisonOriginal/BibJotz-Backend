
import { Church } from "./church";
import { URL } from "../shared/value-objects/URL";
import { Email } from "../shared/value-objects/Email";
import { Address } from "../shared/value-objects/Address";
import { PhoneNumber } from "../shared/value-objects/PhoneNumber";
import { State } from "../shared/value-objects/Address";


interface IChurchFactory {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    website: string;
    email: string;
    phone: string;
}

export class ChurchFactory {
    static create(data: IChurchFactory): Church {
        if (!data.name) {
            throw new Error('Name is required');
        }
        if (!data.street) {
            throw new Error('Street is required');
        }
        if (!data.city) {
            throw new Error('City is required');
        }
        if (!data.state) {
            throw new Error('State is required');
        }
        if (!data.zip) {
            throw new Error('Zip is required');
        }
        if (!data.website) {
            throw new Error('Website is required');
        }
        if (!data.email) {
            throw new Error('Email is required');
        }
        if (!data.phone) {
            throw new Error('Phone is required');
        }
        return new Church(
            null,
                data.name, 
            Address.create(
                data.street, 
                data.city,   
                data.state as State, 
                data.zip
            ), 
            URL.create(data.website), 
            Email.create(data.email), 
            PhoneNumber.create(data.phone),
            new Date(),
            new Date()
        );
    }
}