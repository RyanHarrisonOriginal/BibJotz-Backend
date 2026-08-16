# Command and Query Standard

Commands and queries own parsing. Controllers pass the raw HTTP shape into `from(dto)`.

---

## Core rule: `from()` parses the DTO

- Accept the **request DTO** (Express `req.body`, `req.query`, `req.params`, or a combination).
- Parse, coerce, and validate **inside `from()`**.
- Return `new Command(...)` / `new Query(...)`.

Domain `*.dto.ts` files define **interfaces only**. No parsing functions there.

---

## Commands

Every command:

1. `readonly commandType = 'CreateNoteCommand'` (must match bus registration)
2. Constructor with the typed fields the handler needs
3. `static from(dto: IRequestDTO): Command`

Controller:

```ts
const command = CreateNoteCommand.from(req.body);
const result = await this.commandBus.execute(command);
```

Params + body:

```ts
const command = UpdateNoteCommand.from({ ...req.params, ...req.body });
```

---

## Queries

Same pattern. `readonly queryType` must match bus registration.

```ts
const query = ListNotesQuery.from(req.query);
const result = await this.queryBus.execute(query);
```

Query-string values are `string | string[]`. Parse to numbers inside `from()`.

---

## Checklist

- [ ] Request DTO interface in domain `*.dto.ts`
- [ ] `static from(dto)` does all parsing/coercion/validation
- [ ] Controller only calls `from()` and the bus
- [ ] Handler is registered in `command-bus-setup.ts` or `query-bus-setup.ts`
