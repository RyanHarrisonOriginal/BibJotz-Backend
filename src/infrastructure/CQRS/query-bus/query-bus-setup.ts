import { IChurchRepository } from "@/domain/Church/church-repository.interface";
import { QueryBus } from "./query-bus";
import { GetUserQueryHandler } from "@/domain/User/queries/get-user/get-user.query.handler";
import { IUserRepository } from "@/domain/User/user-repository.interface";
import { GetChurchQueryHandler } from "@/domain/Church/queries/get-church/get-church.query.handler";
import { GetAllChurchesQueryHandler } from "@/domain/Church/queries/get-all-churches/get-all-churches.query.handler";
import { GetGuideByIdCommandHandler } from "@/domain/Guide/queries/get-guide-by-id/get-guide-by-id-commnad.handler";
import { IGuideRepository } from "@/domain/Guide/guide-repository.interface";

interface IQueryBusSetup {
    userRepository: IUserRepository;
    churchRepository: IChurchRepository;
    guideRepository: IGuideRepository;
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
    
    return queryBus;
}