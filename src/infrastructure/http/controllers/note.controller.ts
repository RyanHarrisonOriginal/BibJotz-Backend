import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { CreateNoteCommand } from '@/domain/Note/commands/create-note/create-note.command';
import { UpdateNoteCommand } from '@/domain/Note/commands/update-note/update-note.command';
import { DeleteNoteCommand } from '@/domain/Note/commands/delete-note/delete-note.command';
import { TagNoteCommand } from '@/domain/Note/commands/tag-note/tag-note.command';
import { UntagNoteCommand } from '@/domain/Note/commands/untag-note/untag-note.command';
import { GetNoteQuery } from '@/domain/Note/queries/get-note/get-note.query';
import { ListNotesQuery } from '@/domain/Note/queries/list-notes/list-notes.query';

export class NoteController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  createNote = async (req: Request, res: Response): Promise<void> => {
    const command = CreateNoteCommand.from(req.body);
    const result = await this.commandBus.execute<CreateNoteCommand, Note>(command);
    res.status(201).json(NoteMapper.mapNoteToResponseDTO(result));
  };

  updateNote = async (req: Request, res: Response): Promise<void> => {
    const command = UpdateNoteCommand.from({ ...req.params, ...req.body });
    const result = await this.commandBus.execute<UpdateNoteCommand, Note>(command);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  deleteNote = async (req: Request, res: Response): Promise<void> => {
    const command = DeleteNoteCommand.from(req.params);
    await this.commandBus.execute(command);
    res.status(204).send();
  };

  tagNote = async (req: Request, res: Response): Promise<void> => {
    const command = TagNoteCommand.from({ ...req.params, ...req.body });
    const result = await this.commandBus.execute<TagNoteCommand, Note>(command);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  untagNote = async (req: Request, res: Response): Promise<void> => {
    const command = UntagNoteCommand.from(req.params);
    const result = await this.commandBus.execute<UntagNoteCommand, Note>(command);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  getNote = async (req: Request, res: Response): Promise<void> => {
    const query = GetNoteQuery.from(req.params);
    const result = await this.queryBus.execute<GetNoteQuery, Note>(query);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  listNotes = async (req: Request, res: Response): Promise<void> => {
    const query = ListNotesQuery.from(req.query);
    const result = await this.queryBus.execute<ListNotesQuery, Note[]>(query);
    res.json(NoteMapper.mapNotesToResponseDTO(result));
  };
}
