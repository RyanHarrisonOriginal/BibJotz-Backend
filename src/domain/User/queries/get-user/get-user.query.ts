import { IGetUserQuery } from "@/domain/User/queries/get-user/get-user-query.interface";

export class GetUserQuery implements IGetUserQuery {
  public readonly userId: string;
  public readonly queryType = 'GetUserQuery';

  constructor(userId: string) {
    this.userId = userId;
  }
}
