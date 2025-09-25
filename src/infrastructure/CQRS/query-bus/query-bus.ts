import { IQueryHandler } from "@/domain/interfaces/shared/query-handler.interface";
import { IQuery } from "@/domain/interfaces/shared/query.interface";

export class QueryBus {
    private handlers: Map<string, IQueryHandler<any, any>> = new Map();

    registerHandler<QueryType extends IQuery, ResultType = any>(
        queryType: string, 
        handler: IQueryHandler<QueryType, ResultType>
    ): void {
        this.handlers.set(queryType, handler);
    }

    async execute<QueryType extends IQuery, ResultType = any>(
        query: QueryType
    ): Promise<ResultType> {
        const handler = this.handlers.get(query.queryType);
        if (!handler) {
            throw new Error(`No handler registered for query type: ${query.queryType}`);
        }
        try {
            return handler.execute(query);
        } catch (error) {
            // Log the error or handle it as needed
            // TODO: Replace with proper logging service
            throw error;
        }
    }

    hasHandler(queryType: string): boolean {
        return this.handlers.has(queryType);
    }

    getRegisteredQueryTypes(): string[] {
        return Array.from(this.handlers.keys());
    }
}