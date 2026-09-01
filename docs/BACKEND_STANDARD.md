# Backend Standard

This is the **canonical architecture** for the BibJotz API. All new backend work follows this document. Companion docs:

- [COMMAND_STANDARD.md](COMMAND_STANDARD.md) — Command/Query `from(dto)` parsing
- [MAPPING_AND_DTO_STANDARD.md](MAPPING_AND_DTO_STANDARD.md) — Mappers and DTOs
- [SWAGGER_STANDARD.md](SWAGGER_STANDARD.md) — OpenAPI layout

---

## 1. What this API is

The BibJotz API is the **only** application server for Bible reading and note-taking.

It does two things:

1. **Read scripture** from the existing Bible corpus (Postgres schema `app`).
2. **Store and retrieve notes** attached to a verse, verse range, non-contiguous verse set, chapter, or book (Postgres schema `jotz`).

AI topic detection is a planned port. It is **not** implemented. Do not add vendor SDKs into domain code.

---

## 2. Architecture: DDD + CQRS + Ports and Adapters

```
HTTP  →  Controller  →  CommandBus / QueryBus  →  Handler  →  Domain
                                                              ↓
                                                         Port (interface)
                                                              ↓
                                              Adapter (Prisma repository, future AI, etc.)
```

| Idea | How we use it |
|------|----------------|
| **DDD** | Domain folders own entities, factories, mappers, DTOs, commands, queries, and **ports** (interfaces). |
| **CQRS** | Writes go through **commands**. Reads go through **queries**. Each has a handler registered on a bus. |
| **Ports and adapters** | Domain depends on interfaces. Infrastructure implements them. Swap Postgres or add an AI adapter without changing domain logic. |
| **Repositories** | Persistence ports. Postgres adapters live in `infrastructure/persistence/postgres`. |

Domain code **never** imports Prisma, Express, or vendor SDKs.

---

## 3. Folder layout

```
src/
  domain/                          # application + domain (no frameworks)
    shared/                        # base entity, errors, buses' interfaces, value objects
    Bible/                         # scripture reads
    Note/                          # notes (the core product)
    User/                          # lightweight reader identity
  infrastructure/                  # adapters
    CQRS/                          # command bus, query bus, wiring
    database/                      # Prisma clients
    persistence/postgres/          # repository adapters
    adapters/                      # non-DB adapters (e.g. future topic detection)
    http/                          # Express controllers, routes, swagger
  middleware/
  index.ts                         # composition root — wire adapters into buses
```

### Domain folder recipe (every bounded context)

```
domain/Note/
  note.ts                          # entity
  note-factory.ts
  note.mapper.ts                   # ALL shape translation
  note.dto.ts                      # HTTP request/response interfaces only
  note-repository.interface.ts     # port
  ports/                           # other ports (e.g. topic-detector.port.ts)
  commands/<verb-noun>/
    <verb-noun>.command.ts
    <verb-noun>-command.handler.ts
  queries/<verb-noun>/
    <verb-noun>.query.ts
    <verb-noun>-query.handler.ts
```

Bible is read-only, so it has queries only.

---

## 4. Data flow

### Write (command)

1. Controller types HTTP input as a **request DTO**.
2. `Command.from(dto)` parses and validates.
3. `commandBus.execute(command)` dispatches to the registered handler.
4. Handler builds a **domain entity** via Factory (and value objects).
5. Handler calls a **repository port**. The Postgres adapter persists.
6. Repository returns **raw** persistence data.
7. Handler uses **Mapper** raw → domain and returns the domain object.
8. Controller uses **Mapper** domain → **response DTO**, then `res.json()`.

### Read (query)

Same, except no entity mutation. Handler loads raw rows, maps to internal/domain types, controller maps to response DTOs.

---

## 5. Ports and adapters

A **port** is a TypeScript interface in the domain. An **adapter** is an infrastructure class that implements it.

| Port | Adapter | Notes |
|------|---------|--------|
| `IBibleRepository` | `BiblePostgresRepository` | Read-only. Prisma client generated from `prisma/bible`. Schema `app`. **Never migrate this schema.** |
| `INoteRepository` | `NotePostgresRepository` | Prisma client from `prisma/app`. Schema `jotz`. |
| `IUserRepository` | `UserPostgresRepository` | Same app Prisma client. |
| `ITopicDetector` | `NoopTopicDetectorAdapter` | Stub. Not wired into handlers yet. |

Composition root (`src/index.ts`) constructs adapters and injects them into bus setup. Handlers receive ports, never Prisma.

When adding an external service (email, AI, auth provider):

1. Define a port in `domain/<Context>/ports/`.
2. Implement an adapter under `infrastructure/adapters/<service>/`.
3. Wire it in `index.ts`.

---

## 6. Two Prisma schemas, two databases

The Bible corpus and application data live on separate Neon databases.

| Schema file | Env var | Prisma client output | Postgres schema | Migrations |
|-------------|---------|----------------------|-----------------|------------|
| `prisma/bible/schema.prisma` | `BIBLE_DATABASE_URL` | `src/generated/bible-client` | `app` | **Generate only** |
| `prisma/app/schema.prisma` | `DATABASE_URL` | `src/generated/app-client` | `jotz` | `npm run db:migrate` |

```bash
npm run db:generate          # both clients
npm run db:migrate           # jotz only (bibjotz database)
```

---

## 7. Notes model (product rules)

A note belongs to a user and a **scripture reference**.

`ScriptureReference` is a value object. **Scope is derived**, never sent by the client as a source of truth:

| Fields set | Scope |
|------------|--------|
| book | `BOOK` |
| book + chapter | `CHAPTER` |
| book + chapter + one verse | `VERSE` |
| book + chapter + contiguous verses | `VERSE_RANGE` |
| book + chapter + non-contiguous verses (`verses` or multiple spans) | `VERSE_SET` |

Clients send `verses: number[]` (preferred) or `startVerse`/`endVerse`. The domain compresses verses into spans (`16–18, 21`). `startVerse`/`endVerse` on the row are the bounding range for indexes.

`referenceLabel` is formatted for UI (`John 3:16`, `John 3:16–18, 21`, `John 3`, `John`).

Listing notes for a chapter (`?book=John&chapter=3`) also returns **whole-book** notes for that book.

---

## 8. Composition root

`src/index.ts` is the only place that:

- Instantiates Prisma clients
- Instantiates repository adapters
- Calls `setupCommandBus` / `setupQueryBus`
- Mounts Express routes

Do not construct Prisma inside handlers or domain.

---

## 9. HTTP conventions

- Base path: `/api/v1`
- Docs: `/api-docs`
- Health: `/health` and `/api/v1/health`
- Errors: `{ success: false, error: { message, statusCode } }`
- Domain `AppError` / `ValidationError` (400) / `NotFoundError` (404) map through `errorHandler`
- Async routes use `asyncHandler` so thrown errors reach middleware

---

## 10. Checklist for a new feature

- [ ] Domain entity / value object if there is new business meaning
- [ ] Port (repository or other) in the domain folder
- [ ] Postgres (or other) adapter implementing the port
- [ ] Request/response DTO interfaces only (no functions) in `*.dto.ts`
- [ ] Mapper methods for raw → domain and domain → response DTO
- [ ] Command or Query with `static from(dto)` doing all parsing
- [ ] Handler using factory + mapper + port
- [ ] Register handler in command-bus-setup or query-bus-setup
- [ ] Thin controller: `from()` → bus → mapper → `res.json()`
- [ ] Route + swagger operation file + root `swagger.yaml` path entry
- [ ] No Prisma, Express, or vendor imports in `domain/`
