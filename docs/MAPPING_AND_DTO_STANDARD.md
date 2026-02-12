# Mapping and DTO Standard

This document defines how **mapping** and **DTOs** are used in this project. It complements [COMMAND_STANDARD.md](COMMAND_STANDARD.md) (which covers Command/Query `from(dto)` parsing).

---

## 1. Mapping Rule

**All logic that translates the shape of an object from one type to another is delegated to a Mapper class in the owning domain folder** (e.g. `JourneyMapper` in `domain/Jouney/`, `GuideMapper` in `domain/Guide/`).

- **No other place** may perform mapping: not in repositories, handlers, controllers, factories, or other services.
- Repositories return **persistence/raw shapes** (e.g. raw query rows, Prisma models).
- Handlers and controllers use the appropriate **Mapper** to convert between:
  - persistence/raw → domain or internal type (in the handler, after repository call)
  - domain/internal → response DTO (in the controller, before `res.json()`)

---

## 2. DTO Definition and Scope

**DTOs are used solely to describe the structure of data transferred across the HTTP boundary** — i.e. request payloads (body, query, params) and response payloads (response body).

**DTOs are only used in controllers:**

| Boundary   | Use |
|------------|-----|
| **Request**  | The controller passes the incoming HTTP data (typed as a request DTO) into the Command or Query’s `from(dto)` method. See [COMMAND_STANDARD.md](COMMAND_STANDARD.md). |
| **Response** | The controller obtains the handler result, uses the domain **Mapper** to convert it to a **response DTO**, then sends it with `res.json(responseDto)`. |

**Implications:**

- No DTO types in **repository interfaces** or **handler return types**.
- No DTO types in domain entities.
- Response DTO types appear only in: (1) the controller, (2) the Mapper method that builds the response (e.g. `JourneyMapper.mapJourneyLibraryToResponseDTO()`).

---

## 3. Command and Query Parsing (recap)

The Command or Query’s static **`from(dto)`** method is responsible for **parsing the request DTO** (from the controller) into the exact shape required by the command/query’s **execute** path (handler). All parsing, coercion (e.g. string → number), and defaults happen inside `from()`.

See [COMMAND_STANDARD.md](COMMAND_STANDARD.md) for full details.

---

## 4. Data Flow Summary

1. **Request:** Controller types HTTP input as request DTO → calls `Command.from(dto)` or `Query.from(dto)`.
2. **Persistence → app:** Repository returns raw/persistence shape → handler calls **Mapper** to get domain or internal type → handler returns that type.
3. **App → HTTP:** Controller receives handler result → controller calls **Mapper** to get response DTO → `res.json(responseDto)`.

---

## 5. Checklist for New Features

- [ ] Define **request DTO** (and **response DTO** if the endpoint returns a body) in the domain `*.dto.ts`. Only interfaces; no parsing or mapping logic in DTO files.
- [ ] Put **all mapping** in the domain **Mapper** class: raw/persistence → internal/domain, and (for reads) internal/domain → response DTO.
- [ ] Repository methods return **raw or persistence types** only (e.g. `Promise<any[]>` for raw rows). No DTO in repository interface.
- [ ] Handler calls repository, then **Mapper** to convert to domain/internal type; handler **return type is not a DTO**.
- [ ] Controller: for responses, call **Mapper.mapToResponseDTO(result)** (or equivalent), then `res.json(responseDto)`.
