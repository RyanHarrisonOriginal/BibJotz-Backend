# Swagger Documentation Standard

## Rule

**All HTTP endpoints must be documented in the Swagger docs folder using the current method.** No new route or change to an existing route is complete without a corresponding Swagger operation and, when using the ref-based layout, a dedicated operation file.

---

## Current Method

### Root spec

- Single OpenAPI 3.0.0 spec: `src/swagger.yaml`.
- Defines `paths` with full path and HTTP method. Base path for the API: `/api/v1` (e.g. `/api/v1/journeys`, `/api/v1/journeys/library`).
- Each operation does **not** inline the full operation; it uses **`$ref`** to a file under the swagger-docs folder.

### Folder and file layout

- **Directory:** `src/infrastructure/http/routes/swagger-docs/`.
- One subfolder per **resource** (plural, PascalCase): e.g. `Churches/`, `Journeys/`, `Drafts/`, `Guides/`, `Reflections/`, `Users/`.
- One YAML file per **operation** (or per logical endpoint). Filename pattern: **`<resource>-<method-or-action>.swagger.yaml`** in kebab-case.

Examples:

- `journey-get.swagger.yaml`, `journey-post.swagger.yaml`
- `church-get.swagger.yaml`, `church-post.swagger.yaml`
- `draft-get.swagger.yaml`, `draft-get-all-by-user.swagger.yaml`

For a new endpoint like GET `/journeys/library`, the operation would live in a file such as `journey-library-get.swagger.yaml` under `Journeys/`, and the root spec would add a path entry for `/api/v1/journeys/library` with a `get` operation that `$ref`s that file.

### Content of each operation file (the fragment)

The referenced file contains only the **operation object** (no `paths` or `path` key). It typically includes:

- **summary** — short one-line description
- **description** — (optional) longer description
- **parameters** — (if any) `name`, `in` (path/query/header), `required`, `schema` or `type`
- **responses** — status codes (e.g. `200`, `404`, `500`) with `description` and, for success responses, `content.application/json.schema` describing the response body

Tags are **not** repeated in the fragment; they are set in the root `swagger.yaml` next to the `$ref` (e.g. `tags: - Journeys`).

### How the root spec references the fragment

Under the path and method, the root spec has `tags` and `$ref`.

Example (GET journey by query params):

```yaml
/api/v1/journeys:
  get:
    tags:
      - Journeys
    $ref: './infrastructure/http/routes/swagger-docs/Journeys/journey-get.swagger.yaml'
```

The `$ref` path is relative to the root spec. The project uses `SwaggerParser.bundle('./src/swagger.yaml')` from `src/index.ts`, so references resolve from the spec’s location.

---

## Checklist for new or changed endpoints

- [ ] Every new or changed endpoint has a path and method entry in `src/swagger.yaml`.
- [ ] A corresponding operation file exists under `src/infrastructure/http/routes/swagger-docs/<Resource>/` with the naming convention above (e.g. `<resource>-<action>.swagger.yaml`).
- [ ] The operation file includes at least `summary`, `parameters` (if any), and `responses` (with schema for success where applicable).
