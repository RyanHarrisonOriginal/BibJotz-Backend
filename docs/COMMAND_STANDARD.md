# Command and Query Standard

This document defines the standard pattern for **commands** and **queries** in this project. All commands and queries must follow this pattern for consistency, type safety, and maintainability.

---

## Core Rule: `from()` Parses the DTO

**Commands and queries own parsing.** Controllers pass the **raw HTTP request shape** (body, query, params) into the command/query’s static `from(dto)` method. The command/query is responsible for:

- Accepting the **request DTO** (the shape that Express gives you: strings from query/params, optional fields, etc.)
- Parsing and validating (e.g. `parseInt`, defaults, coercion) **inside `from()`**
- Returning a fully constructed command or query instance

**Domain DTO files** (e.g. `journey.dto.ts`, `church.dto.ts`) define **only request shapes** (interfaces). They must **not** contain parsing logic, payload mappers, or any “command/query concerns.” Parsing belongs in the command/query’s `from()` method.

### Why

| Approach | Problem |
|----------|--------|
| **Parsing in domain DTO** (e.g. `findJourneyQueryParamsToPayload()` in `journey.dto.ts`) | Command/query concerns leak into the domain layer. DTOs become coupled to command/query payloads and HTTP parsing. |
| **Parsing in `from(dto)`** | Single place for “how we build this from HTTP.” Controllers stay thin: `Command.from(req.body)` or `Query.from(req.query)`. Domain DTOs stay pure shapes. |

### Benefits

- **Thin controllers**: `CreateJourneyCommand.from(req.body)`, `FindJourneyQuery.from(req.query)` — no manual payload building or mapper calls in the controller.
- **No parsing in domain DTOs**: Domain `*.dto.ts` files only define interfaces (request shapes). No functions that convert DTO → payload.
- **Single place for parsing**: All string→number, defaults, and validation live in the command/query that uses them.
- **Consistent**: Same pattern for every command and query across the codebase.

---

## Part 1: Commands

### Required Structure

Every command must have:

1. **Static `from(dto)`**  
   Accepts the **request DTO** (HTTP body, or params+body combined). The DTO type is the shape the controller gets from `req.body`, `req.params`, or a combined object. `from()` parses/validates and returns `new Command(...)`.

2. **Constructor**  
   Unchanged: same positional parameters for internal/handler use.

3. **Request DTO types**  
   Defined in the domain’s `*.dto.ts` (or next to the command when request shape is command-specific). Only **interfaces**; no mapper functions in the DTO file.

### Controller usage

- **Body only:** `Command.from(req.body)`
- **Params only:** `Command.from(req.params)`
- **Params + body:** `Command.from({ ...req.params, ...req.body })` or `Command.from({ paramKey: req.params.x, bodyKey: req.body.y })`

### Example (body DTO)

```ts
// journey.dto.ts — only shapes, no functions
export interface IJourneyDTO {
    title: string;
    ownerId: number;
    guideId: number;
    // ...
}

// create-journey.command.ts
import { IJourneyDTO } from "@/domain/Jouney/journey.dto";

export class CreateJourneyCommand implements ICommand {
    constructor(
        public readonly name: string,
        public readonly ownerId: number,
        public readonly guideId: number,
    ) {}

    /** Parse HTTP body DTO. Controllers call CreateJourneyCommand.from(req.body). */
    static from(dto: IJourneyDTO): CreateJourneyCommand {
        return new CreateJourneyCommand(dto.title, dto.ownerId, dto.guideId);
    }
}
```

Controller:

```ts
const command = CreateJourneyCommand.from(req.body);
await this.commandBus.execute(command);
```

### Example (query params DTO)

```ts
// journey.dto.ts
export interface IFindJourneyQueryParamsDTO {
    id?: string | string[];
    ownerId?: string | string[];
    guideId?: string | string[];
}

// find-journey.query.ts
import { IFindJourneyQueryParamsDTO } from "@/domain/Jouney/journey.dto";

export class FindJourneyQuery implements IQuery {
    constructor(
        public readonly journeyId?: number,
        public readonly ownerId?: number,
        public readonly guideId?: number,
    ) {}

    /** Parse HTTP query DTO (strings) into query. Controllers call FindJourneyQuery.from(req.query). */
    static from(dto: IFindJourneyQueryParamsDTO): FindJourneyQuery {
        const parse = (v: string | string[] | undefined): number | undefined => {
            if (v == null || v === "") return undefined;
            const n = parseInt(String(v), 10);
            return Number.isNaN(n) ? undefined : n;
        };
        return new FindJourneyQuery(parse(dto.id), parse(dto.ownerId), parse(dto.guideId));
    }
}
```

Controller:

```ts
const query = FindJourneyQuery.from(req.query);
const result = await this.queryBus.execute(query);
```

### Example (params + body)

```ts
// draft.dto.ts
export interface IUpdateDraftRequestDTO {
    draftKey?: string;
    draftContent?: Record<string, unknown>;
}

// update-draft.command.ts
static from(dto: IUpdateDraftRequestDTO): UpdateDraftCommand {
    return new UpdateDraftCommand(dto.draftKey ?? "", dto.draftContent);
}
```

Controller:

```ts
const command = UpdateDraftCommand.from({
    draftKey: req.params.draftKey,
    draftContent: req.body.draftContent,
});
```

---

## Part 2: Queries

Same rule as commands: **`from(dto)` accepts the HTTP request shape and does all parsing inside the query.**

- **Query params:** `Query.from(req.query)` — DTO has string/string[] types; query parses to numbers etc. inside `from()`.
- **Route params:** `Query.from(req.params)` — DTO has optional string fields; query parses inside `from()`.
- **Combined (e.g. userId from auth):** `Query.from({ userId })` — request DTO type documents the shape.

---

## Domain DTO Files: Shapes Only

- **Do:** Define interfaces for request shapes (`IJourneyDTO`, `IFindJourneyQueryParamsDTO`, `IGetChurchQueryParamsDTO`, `IDraftKeyParamsDTO`, etc.).
- **Do not:** Define functions that convert DTO → payload or that parse strings to numbers. No `*ToPayload`, `*ParamsToPayload`, or similar in domain `*.dto.ts` files.

Parsing and construction belong in the command/query’s `from()` method.

---

## Checklist for New Commands

- [ ] Define the **request DTO** interface (in domain `*.dto.ts` or next to the command).
- [ ] Implement `static from(dto: IRequestDTO): Command` and do **all** parsing/coercion inside `from()`.
- [ ] In controllers, call only `Command.from(req.body)` or `Command.from({ ... })`; do not build payloads or call mappers in the controller.

## Checklist for New Queries

- [ ] Define the **request DTO** interface (in domain `*.dto.ts` or next to the query).
- [ ] Implement `static from(dto: IRequestDTO): Query` and do **all** parsing/coercion inside `from()`.
- [ ] In controllers, call only `Query.from(req.query)` or `Query.from(req.params)` (or combined); do not build payloads or call mappers in the controller.

## Checklist for Domain DTOs

- [ ] Only **interfaces** (request shapes). No functions that parse or map to command/query payloads.

---

*Last updated: from() parses DTO; no parsing in domain DTO files.*
