import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { DraftPostgresRepository } from "@/infrastructure/persistence/postgres/draft-postgres-repository";
import { GuidePostgresRepository } from "@/infrastructure/persistence/postgres/guide-postgres-repository";
import { ITransactionRunner } from "./transaction-runner.interface";
import { PrismaClient } from "@prisma/client";

export type PublishUoW = {
    drafts: IDraftRepository;
    guides: IGuideRepository;
};

export interface DraftPublishingRunner extends ITransactionRunner<PublishUoW> {
    run<T>(fn: (uow: PublishUoW) => Promise<T>): Promise<T>;
}

export class GuideDraftPublishingRunner
    implements DraftPublishingRunner {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async run<T>(fn: (uow: PublishUoW) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const uow: PublishUoW = {
                drafts: new DraftPostgresRepository(tx),
                guides: new GuidePostgresRepository(tx),
            };

            return fn(uow);
        });
    }
}
