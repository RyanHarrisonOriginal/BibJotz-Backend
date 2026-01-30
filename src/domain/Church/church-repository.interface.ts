import { Address, State } from "../shared/value-objects/Address";
import { Church } from "./church";

export interface IChurchRepository {
    save(church: Church): Promise<any>;
    findById(id: number): Promise<any>;
    findByName(name: string): Promise<any>;
    findByCity(city: string): Promise<any>;
    findByState(state: State): Promise<any>;
    findByZip(zip: string): Promise<any>;
    findByAddress(address: Address): Promise<any>;
    findAll(): Promise<any[]>;
}