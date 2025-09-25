import { ICreateChurchCommand } from "./commands/create-church/create-church-command.interface";
import { Church } from "./church";
import { URL } from "../shared/value-objects/URL";
import { Email } from "../shared/value-objects/Email";
import { Address } from "../shared/value-objects/Address";
import { PhoneNumber } from "../shared/value-objects/PhoneNumber";
import { State } from "../shared/value-objects/Address";
export class ChurchFactory {
    static create(command: ICreateChurchCommand): Church {
        if (!command.name) {
            throw new Error('Name is required');
        }
        if (!command.street) {
            throw new Error('Street is required');
        }
        if (!command.city) {
            throw new Error('City is required');
        }
        if (!command.state) {
            throw new Error('State is required');
        }
        if (!command.zip) {
            throw new Error('Zip is required');
        }
        if (!command.website) {
            throw new Error('Website is required');
        }
        if (!command.email) {
            throw new Error('Email is required');
        }
        if (!command.phone) {
            throw new Error('Phone is required');
        }
        return new Church(
            null,
            command.name, 
            Address.create(
                command.street, 
                command.city,   
                command.state as State, 
                command.zip
            ), 
            URL.create(command.website), 
            Email.create(command.email), 
            PhoneNumber.create(command.phone),
            new Date(),
            new Date()
        );
    }
}