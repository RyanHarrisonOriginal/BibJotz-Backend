import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ReferenceType } from '@/domain/Reference/reference-type';
import { ReferenceTypeMapper } from '@/domain/Reference/reference-type.mapper';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { UpdateReferenceTypeCommand } from './update-reference-type.command';

export class UpdateReferenceTypeCommandHandler
  implements ICommandHandler<UpdateReferenceTypeCommand, ReferenceType>
{
  constructor(private readonly referenceTypeRepository: IReferenceTypeRepository) {}

  async execute(command: UpdateReferenceTypeCommand): Promise<ReferenceType> {
    const existing = await this.referenceTypeRepository.findById(command.id);
    if (!existing) throw new NotFoundError('Reference type not found');

    const type = ReferenceTypeMapper.mapReferenceTypeToDomain(existing);
    type.rename(command.name);

    const duplicate = await this.referenceTypeRepository.findByUserIdAndNormalizedName(
      type.getUserId(),
      type.getNormalizedName(),
    );
    if (duplicate) {
      const other = ReferenceTypeMapper.mapReferenceTypeToDomain(duplicate);
      if (other.getId() !== type.getId()) {
        throw new ValidationError('A type with that name already exists');
      }
    }

    const saved = await this.referenceTypeRepository.save(type);
    return ReferenceTypeMapper.mapReferenceTypeToDomain(saved);
  }
}
