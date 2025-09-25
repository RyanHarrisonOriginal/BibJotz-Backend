import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { Church } from "@/domain/Church/church";
import { PrismaClient } from "@prisma/client";
import { ChurchMapper } from "@/infrastructure/mappers/church.mapper";
import { Address, State } from "@/domain/shared/value-objects/Address";

export class ChurchPostgresRepository implements IChurchRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(church: Church): Promise<Church> {
        const churchData = {
            name: church.getName(),
            street: church.getAddress().getStreet(),
            city: church.getAddress().getCity(),
            state: church.getAddress().getState(),
            zip: church.getAddress().getZip(),
            website: church.getWebsite()?.getValue(),
            email: church.getEmail()?.getValue(),
            phone: church.getPhone()?.getValue(),
        };

        const savedChurch = await this.prisma.church.create({
            data: churchData,
        });

        return ChurchMapper.mapToDomain(savedChurch);   
    }

    async findById(id: number): Promise<Church> {
        const church = await this.prisma.church.findUnique({
            where: { id },
        });

        if (!church) {
            throw new Error(`Church with id ${id} not found`);
        }

        return ChurchMapper.mapToDomain(church);
    }
    
    async findByName(name: string): Promise<Church> {
        const church = await this.prisma.church.findFirst({
            where: { name },
        });

        if (!church) {
            throw new Error(`Church with name ${name} not found`);
        }

        return ChurchMapper.mapToDomain(church);
    }

    async findByCity(city: string): Promise<Church> {
        const church = await this.prisma.church.findFirst({
            where: { city },
        });
        
        if (!church) {
            throw new Error(`Church with city ${city} not found`);
        }

        return ChurchMapper.mapToDomain(church);
    }

    async findByState(state: State): Promise<Church> {
        const church = await this.prisma.church.findFirst({
            where: { state },
        });
        
        if (!church) {
            throw new Error(`Church with state ${state} not found`);
        }

        return ChurchMapper.mapToDomain(church);
    }

    async findByZip(zip: string): Promise<Church> {
        const church = await this.prisma.church.findFirst({
            where: { zip },
        });
        
        if (!church) {
            throw new Error(`Church with zip ${zip} not found`);
        }

        return ChurchMapper.mapToDomain(church);
    }

    async findByAddress(address: Address): Promise<Church> {
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

        return ChurchMapper.mapToDomain(church);
    }

    async findAll(): Promise<Church[]> {
        const churches = await this.prisma.church.findMany();
        return churches.map(church => ChurchMapper.mapToDomain(church));
    }
            
}