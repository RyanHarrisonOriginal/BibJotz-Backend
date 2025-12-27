export interface ITransactionRunner<UoW> {
    run<T>(fn: (uow: UoW) => Promise<T>): Promise<T>;
}