# Mapping and DTO Standard

Complements [COMMAND_STANDARD.md](COMMAND_STANDARD.md) and [BACKEND_STANDARD.md](BACKEND_STANDARD.md).

---

## Mapping

**All** logic that translates object shape from one type to another lives in a **Mapper** in the owning domain folder (`NoteMapper`, `BibleMapper`, `UserMapper`).

- Do not inline mapping in controllers, handlers, factories, or route files.
- Repositories **may call the Mapper** for domain → persistence on writes. They still must not inline field-by-field mapping.
- Repositories **return raw/persistence** shapes (`Promise<unknown>` / Prisma models).
- Handlers call Mapper **raw → domain/internal**.
- Controllers call Mapper **domain/internal → response DTO**, then `res.json()`.

---

## DTOs

DTOs describe data across the **HTTP boundary** only.

| Boundary | Use |
|----------|-----|
| Request | Controller passes HTTP data into `Command.from(dto)` / `Query.from(dto)` |
| Response | Controller maps handler result via Mapper, then `res.json(responseDto)` |

Do **not** use DTO types in repository interfaces, handler return types, or entities.

`*.dto.ts` files: interfaces only. No functions.

---

## Data flow

1. Request DTO → `from()` → Command/Query
2. Repository raw → Mapper → domain
3. Domain → Mapper → response DTO → HTTP

---

## Checklist

- [ ] Request (and response) DTO interfaces in `*.dto.ts`
- [ ] All mapping in the domain Mapper
- [ ] Repository methods return raw/persistence types
- [ ] Handler return type is domain/internal, not a DTO
- [ ] Controller maps to response DTO before `res.json()`
