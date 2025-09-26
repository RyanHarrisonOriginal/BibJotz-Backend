import { CreateGuideCommand } from "@/domain/Guide/commands/create-guide/create-guide.command";
import { CommandBus } from "@/infrastructure/CQRS/command-bus/command-bus";
import { QueryBus } from "@/infrastructure/CQRS/query-bus/query-bus";
import { Request, Response } from "express";
import { IGuideDTO } from "@/domain/Guide/guide.dto";
import { BiblicalReference } from "@/domain/shared/value-objects/BiblicalReference";
import { GuideSection } from "@/domain/Guide/guide-section";

export class GuideController {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    private toBiblicalReference(bible: any): BiblicalReference {
        return new BiblicalReference(bible.book, bible.chapter, bible.startVerse, bible.endVerse);
    }

    private toGuideSection(section: any): GuideSection {
        return new GuideSection(
            section.title,
            section.description,
            section.biblicalReferences.map((b: any) => this.toBiblicalReference(b))
        );
    }

    createGuide = async (req: Request, res: Response) => {
        try {
        const dto: IGuideDTO = req.body;
        const command = new CreateGuideCommand(
            dto.name,
            dto.description,
            dto.isPublic,
            dto.biblicalReferences.map(bible => this.toBiblicalReference(bible)),
            dto.guideSections.map(section => this.toGuideSection(section)),
        );
            const result = await this.commandBus.execute(command);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: (error as Error).message });
        }
    }
}