import { ICommandHandler } from '@/domain/shared/interfaces/command-handler.interface';
import { NotFoundError } from '@/domain/shared/errors/not-found-error';
import { ValidationError } from '@/domain/shared/errors/validation-error';
import { IReferenceTypeRepository } from '@/domain/Reference/reference-type-repository.interface';
import { DeleteReferenceTypeCommand } from './delete-reference-type.command';

export class DeleteReferenceTypeCommandHandler
  implements ICommandHandler<DeleteReferenceTypeCommand, void>
{
  constructor(private readonly referenceTypeRepository: IReferenceTypeRepository) {}

  async execute(command: DeleteReferenceTypeCommand): Promise<void> {
    const existing = await this.referenceTypeRepository.findById(command.id);
    if (!existing) throw new NotFoundError('Reference type not found');

    const inUse = await this.referenceTypeRepository.countReferences(command.id);
    if (inUse > 0) {
      throw new ValidationError('Move or delete the references of this type first');
    }

    await this.referenceTypeRepository.deleteById(command.id);
  }
}
