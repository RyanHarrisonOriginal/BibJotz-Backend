import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { Reference } from '@/domain/Reference/reference';
import { ReferenceFactory } from '@/domain/Reference/reference-factory';
import { ReferenceMapper } from '@/domain/Reference/reference.mapper';
import { IReferenceRepository } from '@/domain/Reference/reference-repository.interface';
import { ReferenceTypeMapper } from '@/domain/Reference/reference-type.mapper';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { CreateReferenceCommand } from './create-reference.command';

export class CreateReferenceCommandHandler implements ICommandHandler<CreateReferenceCommand, Reference> {
  constructor(
    private readonly referenceRepository: IReferenceRepository,
    private readonly referenceTypeRepository: IReferenceTypeRepository,
  ) {}

  async execute(command: CreateReferenceCommand): Promise<Reference> {
    const typeRow = await this.referenceTypeRepository.findById(command.typeId);
    if (!typeRow) throw new NotFoundError('Reference type not found');
    const type = ReferenceTypeMapper.mapReferenceTypeToDomain(typeRow);
    if (type.getUserId() !== command.userId) {
      throw new ValidationError('Reference type does not belong to this user');
    }

    const parsedTitle = Reference.parseTitle(command.title);
    const author = Reference.parseAuthor(command.author);
    const duplicate = await this.referenceRepository.findByUserTypeAndNormalizedTitle(
      command.userId,
      command.typeId,
      parsedTitle.normalizedTitle,
    );
    if (duplicate) throw new ValidationError('A reference with that title already exists in this type');

    const reference = ReferenceFactory.create({
      id: null,
      userId: command.userId,
      typeId: type.getId()!,
      typeName: type.getName(),
      title: parsedTitle.title,
      normalizedTitle: parsedTitle.normalizedTitle,
      author,
    });
    const saved = await this.referenceRepository.save(reference);
    return ReferenceMapper.mapReferenceToDomain(saved);
  }
}
