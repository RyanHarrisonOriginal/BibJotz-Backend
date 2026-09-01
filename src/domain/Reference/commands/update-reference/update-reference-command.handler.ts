import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { Reference } from '@/domain/Reference/reference';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { ReferenceTypeMapper } from '@/domain/Reference/reference-type.mapper';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { UpdateReferenceCommand } from './update-reference.command';

export class UpdateReferenceCommandHandler implements ICommandHandler<UpdateReferenceCommand, Reference> {
  constructor(
    private readonly referenceRepository: IReferenceRepository,
    private readonly referenceTypeRepository: IReferenceTypeRepository,
  ) {}

  async execute(command: UpdateReferenceCommand): Promise<Reference> {
    const existing = await this.referenceRepository.findById(command.id);
    if (!existing) throw new NotFoundError('Reference not found');

    const reference = ReferenceMapper.mapReferenceToDomain(existing);

    if (command.typeId !== undefined) {
      const typeRow = await this.referenceTypeRepository.findById(command.typeId);
      if (!typeRow) throw new NotFoundError('Reference type not found');
      const type = ReferenceTypeMapper.mapReferenceTypeToDomain(typeRow);
      if (type.getUserId() !== reference.getUserId()) {
        throw new ValidationError('Reference type does not belong to this user');
      }
      reference.retype(type.getId()!, type.getName());
    }

    if (command.title !== undefined) {
      reference.retitle(command.title);
    }

    if (command.author !== undefined) {
      reference.setAuthor(command.author);
    }

    const duplicate = await this.referenceRepository.findByUserTypeAndNormalizedTitle(
      reference.getUserId(),
      reference.getTypeId(),
      reference.getNormalizedTitle(),
    );
    if (duplicate) {
      const other = ReferenceMapper.mapReferenceToDomain(duplicate);
      if (other.getId() !== reference.getId()) {
        throw new ValidationError('A reference with that title already exists in this type');
      }
    }

    const saved = await this.referenceRepository.save(reference);
    return ReferenceMapper.mapReferenceToDomain(saved);
  }
}
