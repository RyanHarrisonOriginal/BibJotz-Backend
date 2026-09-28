import { IQuery } from '@/domain/shared/interfaces/query.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IGetReferenceParamsDTO } from '@/domain/Reference/reference.dto';

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export class GetReferenceQuery implements IQuery {
  readonly queryType = 'GetReferenceQuery';

  constructor(
    public readonly id: number,
    public readonly viewerUserId: number,
  ) {}

  static from(dto: IGetReferenceParamsDTO): GetReferenceQuery {
    const id = parseInt(String(dto.id ?? ''), 10);
    if (Number.isNaN(id) || id < 1) throw new ValidationError('id is required');

    const viewerUserId = parseInt(String(first(dto.viewerUserId) ?? ''), 10);
    if (Number.isNaN(viewerUserId) || viewerUserId < 1) {
      throw new ValidationError('viewerUserId is required');
    }

    return new GetReferenceQuery(id, viewerUserId);
  }
}
