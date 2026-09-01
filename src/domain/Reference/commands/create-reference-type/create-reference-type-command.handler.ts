import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { ReferenceType } from '@/domain/Reference/reference-type';
import { ReferenceTypeFactory } from '@/domain/Reference/reference-type-factory';
import { ReferenceTypeMapper } from '@/domain/Reference/reference-type.mapper';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { CreateReferenceTypeCommand } from './create-reference-type.command';

export class CreateReferenceTypeCommandHandler
  implements ICommandHandler<CreateReferenceTypeCommand, ReferenceType>
{
  constructor(private readonly referenceTypeRepository: IReferenceTypeRepository) {}

  async execute(command: CreateReferenceTypeCommand): Promise<ReferenceType> {
    const parsed = ReferenceType.parseName(command.name);
    const existing = await this.referenceTypeRepository.findByUserIdAndNormalizedName(
      command.userId,
      parsed.normalizedName,
    );
    if (existing) throw new ValidationError('A type with that name already exists');

    const type = ReferenceTypeFactory.create({
      id: null,
      userId: command.userId,
      name: parsed.name,
      normalizedName: parsed.normalizedName,
    });
    const saved = await this.referenceTypeRepository.save(type);
    return ReferenceTypeMapper.mapReferenceTypeToDomain(saved);
  }
}
