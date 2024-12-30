## elo-bff

The classes and modules only must depend of external @nest libraries.
All external dependencies must be on adapters or lib/utils.
If the dependency need config, use a adapter. If not its a util.

## Dependencies

Each module, only access to other module throw use-cases.
The things of my domain import it, the things outside the domain, inject in throw adapters.

Dependency direction:

controllers -> use cases

use cases -> models of him module
use cases -> repositories of him module
use cases -> use cases of other modules

repository -> models of him module

One use case of one module can not be access to repository of other module, because the repository is an adapter and must be injected.

For each group of folders (repository, use-cases) there are one main index.ts but not create one on up level because it create conflicts.

```typescript
@Module({
    imports: [WordsModule], // Modules
    controllers: [UsersController, UsersWordsTranslationsController], // Controllers
    // Use Cases and Repositories
    providers: [
        UsersUseCases,
        UsersRepository,
        UsersWordsTranslationsUseCases,
        UsersInitializeVocabularyUseCase,
        UsersWordsTranslationsRepository,
    ],
    // Only Use Cases
    exports: [UsersUseCases, UsersWordsTranslationsUseCases],
})
```

## React dependency

react -> bff open-api + models.aux (without @Property)
If use files with @Property, then webpack try to pack '@nestjs/swagger' and all of his dependencies.

## Params

Preferably use DTOs to pass parameters through functions. They are easier to scale, modify, and type.
