import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { ITransactionRunner } from "./transaction-runner.interface";
import { PrismaClient } from "@prisma/client";
import { JourneyPostgresRepository } from "@/infrastructure/persistence/postgres/journey-postgres-repository";
import { GuidePostgresRepository } from "@/infrastructure/persistence/postgres/guide-postgres-repository";



export type JourneyWriteUoW = {
    journeys: IJourneyRepository;
    guides: IGuideRepository;
};

export interface JourneyWriteRunner extends ITransactionRunner<JourneyWriteUoW> {
    run<T>(fn: (uow: JourneyWriteUoW) => Promise<T>): Promise<T>;
}

export class JourneyWriteRunner implements JourneyWriteRunner {
    constructor(private readonly prisma: PrismaClient) {}

    async run<T>(fn: (uow: JourneyWriteUoW) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const uow: JourneyWriteUoW = {
                journeys: new JourneyPostgresRepository(tx),
                guides: new GuidePostgresRepository(tx),
            };
            return fn(uow);
        });
    }
}