import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { Church } from "@/domain/Church/church";
import { PrismaClient } from "@prisma/client";
import { ChurchMapper } from "@/domain/Church/church.mapper";
import { Address, State } from "@/domain/shared/value-objects/Address";

export class ChurchPostgresRepository implements IChurchRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(church: Church): Promise<any> {
        const churchData = ChurchMapper.mapChurchToPersistence(church);
        return await this.prisma.church.create({
            data: churchData,
        });
    }

    async findById(id: number): Promise<any> {
        const church = await this.prisma.church.findUnique({
            where: { id },
        });

        if (!church) {
            throw new Error(`Church with id ${id} not found`);
        }

        return church;
    }
    
    async findByName(name: string): Promise<any> {
        const church = await this.prisma.church.findFirst({
            where: { name },
        });

        if (!church) {
            throw new Error(`Church with name ${name} not found`);
        }

        return church;
    }

    async findByCity(city: string): Promise<any> {
        const church = await this.prisma.church.findFirst({
            where: { city },
        });
        
        if (!church) {
            throw new Error(`Church with city ${city} not found`);
        }

        return church;
    }

    async findByState(state: State): Promise<any> {
        const church = await this.prisma.church.findFirst({
            where: { state },
        });
        
        if (!church) {
            throw new Error(`Church with state ${state} not found`);
        }

        return church;
    }

    async findByZip(zip: string): Promise<any> {
        const church = await this.prisma.church.findFirst({
            where: { zip },
        });
        
        if (!church) {
            throw new Error(`Church with zip ${zip} not found`);
        }

        return church;
    }

    async findByAddress(address: Address): Promise<any> {
        const church = await this.prisma.church.findFirst({
            where: { 
                state: address.getState(), 
                zip: address.getZip(), 
                city: address.getCity(), 
                street: address.getStreet(), 
            },
        });

        if (!church) {
            throw new Error(`Church with address ${address.toString()} not found`);
        }

        return church;
    }

    async findAll(): Promise<any[]> {
        return await this.prisma.church.findMany();
    }
            
}