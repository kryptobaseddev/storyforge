## Naming Conventions

We are consistently using camelCase for all file and variable names in our codebase:

- File naming: `camelCase.ts` (e.g., `auth.router.ts`, `project.schema.ts`)
- Variable naming: `camelCase` 
- Class naming: `PascalCase` (e.g., `ProjectModel`)
- Interface naming: `IPascalCase` (e.g., `IUser`)
- Type naming: `TPascalCase` (e.g., `TContext`)
- Enum naming: `PascalCase` (e.g., `GenreType`)
- Function naming: `camelCase` (e.g., `getUserProfile`)
- Constant naming: `UPPER_CASE` (e.g., `MAX_UPLOAD_SIZE`)

For File Naming we will use the file type in the name:

- `schema.ts` for Zod schemas
- `model.ts` for Mongoose models
- `router.ts` for tRPC routers
- `types.ts` for TypeScript types
-- Example: `project.schema.ts`, `project.model.ts`, `project.router.ts`, `project.types.ts`
