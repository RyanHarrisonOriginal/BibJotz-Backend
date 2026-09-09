import { Request, Response } from 'express';
import { CommandBus } from '@/infrastructure/CQRS/command-bus/command-bus';
import { QueryBus } from '@/infrastructure/CQRS/query-bus/query-bus';
import { Note } from '@/domain/Note/note';
import { NoteMapper } from '@/domain/Note/note.mapper';
import { INoteResponseDTO } from '@/domain/Note/note.dto';
import { CreateNoteCommand } from '@/domain/Note/commands/create-note/create-note.command';
import { UpdateNoteCommand } from '@/domain/Note/commands/update-note/update-note.command';
import { DeleteNoteCommand } from '@/domain/Note/commands/delete-note/delete-note.command';
import { TagNoteCommand } from '@/domain/Note/commands/tag-note/tag-note.command';
import { UntagNoteCommand } from '@/domain/Note/commands/untag-note/untag-note.command';
import { GetNoteQuery } from '@/domain/Note/queries/get-note/get-note.query';
import { ListNotesQuery } from '@/domain/Note/queries/list-notes/list-notes.query';
import { GetNoteStreakQuery } from '@/domain/Note/queries/get-note-streak/get-note-streak.query';
import { NoteStreakResult } from '@/domain/Note/queries/get-note-streak/get-note-streak-query.handler';
import { GetFeedQuery } from '@/domain/Note/queries/get-feed/get-feed.query';
import { CreateCommentCommand } from '@/domain/Comment/commands/create-comment/create-comment.command';
import { ListCommentsQuery } from '@/domain/Comment/queries/list-comments/list-comments.query';
import { CommentMapper } from '@/domain/Comment/comment.mapper';
import { ICommentResponseDTO } from '@/domain/Comment/comment.dto';
import { requireAuthUserId } from '@/middleware/auth';

export class NoteController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  createNote = async (req: Request, res: Response): Promise<void> => {
    const command = CreateNoteCommand.from({ ...req.body, userId: requireAuthUserId(req) });
    const result = await this.commandBus.execute<CreateNoteCommand, Note>(command);
    res.status(201).json(NoteMapper.mapNoteToResponseDTO(result));
  };

  updateNote = async (req: Request, res: Response): Promise<void> => {
    const command = UpdateNoteCommand.from({
      ...req.params,
      ...req.body,
      actorUserId: requireAuthUserId(req),
    });
    const result = await this.commandBus.execute<UpdateNoteCommand, Note>(command);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  deleteNote = async (req: Request, res: Response): Promise<void> => {
    const command = DeleteNoteCommand.from({
      ...req.params,
      actorUserId: requireAuthUserId(req),
    });
    await this.commandBus.execute(command);
    res.status(204).send();
  };

  tagNote = async (req: Request, res: Response): Promise<void> => {
    const command = TagNoteCommand.from({
      ...req.params,
      ...req.body,
      actorUserId: requireAuthUserId(req),
    });
    const result = await this.commandBus.execute<TagNoteCommand, Note>(command);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  untagNote = async (req: Request, res: Response): Promise<void> => {
    const command = UntagNoteCommand.from({
      ...req.params,
      actorUserId: requireAuthUserId(req),
    });
    const result = await this.commandBus.execute<UntagNoteCommand, Note>(command);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  getNote = async (req: Request, res: Response): Promise<void> => {
    const query = GetNoteQuery.from(req.params);
    const result = await this.queryBus.execute<GetNoteQuery, Note>(query);
    res.json(NoteMapper.mapNoteToResponseDTO(result));
  };

  listNotes = async (req: Request, res: Response): Promise<void> => {
    const query = ListNotesQuery.from({ ...req.query, userId: String(requireAuthUserId(req)) });
    const result = await this.queryBus.execute<ListNotesQuery, Note[]>(query);
    res.json(NoteMapper.mapNotesToResponseDTO(result));
  };

  getNoteStreak = async (req: Request, res: Response): Promise<void> => {
    const query = GetNoteStreakQuery.from({ ...req.query, userId: String(requireAuthUserId(req)) });
    const result = await this.queryBus.execute<GetNoteStreakQuery, NoteStreakResult>(query);
    res.json(result);
  };

  getFeed = async (req: Request, res: Response): Promise<void> => {
    const query = GetFeedQuery.from({ ...req.query, userId: String(requireAuthUserId(req)) });
    const result = await this.queryBus.execute<GetFeedQuery, INoteResponseDTO[]>(query);
    res.json(result);
  };

  createComment = async (req: Request, res: Response): Promise<void> => {
    const command = CreateCommentCommand.from({
      ...req.body,
      noteId: req.params.id,
      userId: requireAuthUserId(req),
    });
    const result = await this.commandBus.execute<CreateCommentCommand, unknown>(command);
    res.status(201).json(CommentMapper.mapCommentToResponseDTO(result));
  };

  listComments = async (req: Request, res: Response): Promise<void> => {
    const query = ListCommentsQuery.from({
      noteId: req.params.id,
      viewerUserId: String(requireAuthUserId(req)),
    });
    const result = await this.queryBus.execute<ListCommentsQuery, ICommentResponseDTO[]>(query);
    res.json(result);
  };
}
