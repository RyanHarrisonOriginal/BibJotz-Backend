import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { ITransactionRunner } from "./transaction-runner.interface";
import { DraftPostgresRepository } from "@/infrastructure/persistence/postgres/draft-postgres-repository";
import { PrismaClient } from "@prisma/client";


export type GuideDraftUoW = {
    drafts: IDraftRepository;
};

export interface GuideDraftRunner extends ITransactionRunner<GuideDraftUoW> {
    run<T>(fn: (uow: GuideDraftUoW) => Promise<T>): Promise<T>;
}

export class GuideDraftRunner implements GuideDraftRunner {
    constructor(private readonly prisma: PrismaClient) {}

    async run<T>(fn: (uow: GuideDraftUoW) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const uow: GuideDraftUoW = {
                drafts: new DraftPostgresRepository(tx),
            };

            return fn(uow);
        });
    }
}