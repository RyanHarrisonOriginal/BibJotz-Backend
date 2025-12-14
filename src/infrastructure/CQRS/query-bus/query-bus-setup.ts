import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { QueryBus } from "./query-bus";
import { GetUserQueryHandler } from "@/domain/User/queries/get-user/get-user.query.handler";
import { IUserRepository } from "@/domain/User/user-repository.interface";
import { GetChurchQueryHandler } from "@/domain/Church/queries/get-church/get-church.query.handler";
import { GetAllChurchesQueryHandler } from "@/domain/Church/queries/get-all-churches/get-all-churches.query.handler";
import { GetGuideByIdCommandHandler } from "@/domain/Guide/queries/get-guide-by-id/get-guide-by-id-commnad.handler";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";
import { IJourneyRepository } from "@/domain/Jouney/journey-repository.interface";
import { FindJourneyQueryHandler } from "@/domain/Jouney/commands/queries/find-journey/find-journey-query.handler";
import { IDraftRepository } from "@/domain/Drafts/draft-repository.interface";
import { GetDraftByDraftKeyQueryHandler } from "@/domain/Drafts/queries/get-draft-by-id/get-draft-by-id.query.handler";
import { GetAllDraftsByAuthorQueryHandler } from "@/domain/Drafts/queries/get-all-drafts-by-author/get-all-drafts-by-author.query.handler";

interface IQueryBusSetup {
    userRepository: IUserRepository;
    churchRepository: IChurchRepository;
    guideRepository: IGuideRepository;
    journeyRepository: IJourneyRepository;
    draftRepository: IDraftRepository;
}

export function setupQueryBus(queryBusSetup: IQueryBusSetup): QueryBus {
    const queryBus = new QueryBus();
    const getUserHandler = new GetUserQueryHandler(queryBusSetup.userRepository);
    queryBus.registerHandler('GetUserQuery', getUserHandler);
    
    const getChurchHandler = new GetChurchQueryHandler(queryBusSetup.churchRepository);
    queryBus.registerHandler('GetChurchQuery', getChurchHandler);
    
    const getAllChurchesHandler = new GetAllChurchesQueryHandler(queryBusSetup.churchRepository);
    queryBus.registerHandler('GetAllChurchesQuery', getAllChurchesHandler);

    const getGuideByIdHandler = new GetGuideByIdCommandHandler(queryBusSetup.guideRepository);
    queryBus.registerHandler('GetGuideByIdQuery', getGuideByIdHandler);

    const findJourneyHandler = new FindJourneyQueryHandler(queryBusSetup.journeyRepository);
    queryBus.registerHandler('FindJourneyQuery', findJourneyHandler);

    const getDraftByDraftKeyHandler = new GetDraftByDraftKeyQueryHandler(queryBusSetup.draftRepository);
    queryBus.registerHandler('GetDraftByDraftKeyQuery', getDraftByDraftKeyHandler);

    const getAllDraftsByAuthorHandler = new GetAllDraftsByAuthorQueryHandler(queryBusSetup.draftRepository);
    queryBus.registerHandler('GetAllDraftsByAuthorQuery', getAllDraftsByAuthorHandler);
    
    return queryBus;
}