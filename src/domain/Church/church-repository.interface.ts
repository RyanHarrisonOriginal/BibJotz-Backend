import { Address, State } from "../shared/value-objects/Address";
import { Church } from "./church";

export interface IChurchRepository {
    save(church: Church): Promise<Church>;
    findById(id: number): Promise<Church>;
    findByName(name: string): Promise<Church>;
    findByCity(city: string): Promise<Church>;
    findByState(state: State): Promise<Church>;
    findByZip(zip: string): Promise<Church>;
    findByAddress(address: Address): Promise<Church>;
    findAll(): Promise<Church[]>;
}