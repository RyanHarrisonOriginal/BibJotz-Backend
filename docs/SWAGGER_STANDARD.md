# Swagger Documentation Standard

Every HTTP endpoint is documented. A new or changed route is not done until Swagger is updated.

---

## Root spec

- File: `src/swagger.yaml` (OpenAPI 3.0.0)
- Base path: `/api/v1`
- Each operation uses `$ref` to a file under the swagger-docs folder

Loaded in `src/index.ts` via `SwaggerParser.bundle('./src/swagger.yaml')`. Served at `/api-docs`.

---

## Folder layout

`src/infrastructure/http/routes/swagger-docs/`

- One subfolder per resource (plural, PascalCase): `Bible/`, `Notes/`, `Users/`
- One YAML file per operation: `<resource>-<action>.swagger.yaml`

---

## Operation file

Contains only the **operation object** (no `paths` key): `summary`, `parameters`, `requestBody`, `responses`.

Tags live on the root spec next to the `$ref`, not in the fragment.

```yaml
/api/v1/notes:
  post:
    tags:
      - Notes
    $ref: './infrastructure/http/routes/swagger-docs/Notes/notes-post.swagger.yaml'
```

`$ref` paths are relative to `src/swagger.yaml`.

---

## Checklist

- [ ] Path + method in `src/swagger.yaml`
- [ ] Operation file under `swagger-docs/<Resource>/`
- [ ] `summary`, parameters (if any), responses with schema for success bodies
