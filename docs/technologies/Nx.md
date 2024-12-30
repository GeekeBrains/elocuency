# Nx

Nx is a build system with first class monorepo support and powerful integrations.

# Main concepts

Are defined on /workspace.json on:

## platform

"platforms": {

## Project

"projects": {

## Project Id

"platforms": {
"platform-name": {
"projectIds": [

# Dependecies between projects

The allowed dependecies between projects are defined on: .eslinrc.json

```
{
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nrwl/nx", "jsdoc"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nrwl/nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
		// Here add dependencies!!
	    ]
```

# Main commands

Modify the 'workspace.json' and 'tsconfig.base.json'.

# project.json

    •	{workspaceRoot}: Referencia la raíz del monorepo.
    •	{projectRoot}: Referencia la raíz del proyecto actual.
    •	{projectName}: Nombre del proyecto actual.
    •	{sourceRoot}: Ruta al directorio de código fuente del proyecto.

## Run an app

```
> nx serve project-id
```

## Test a module

```
> nx run project-name:test --coverage --coverageReporters=text,text-summary,lcov,json-summary,html --detectOpenHandles
```

## Lint a module

```
> nx run project-name:lint --verbose
```

## Launch all linter from a branch

```
> nx affected --target=lint --base=branch_name~1 --head=$branch_name --verbose --parallel=10
```

## Create a new nestjs app

```
> nx g @nrwl/nest:app --directory=directory-name end-name --dry-run
```

## Create a new node lib

```
> nx g @nrwl/node:library --directory=directory-name --name=end-name  --dry-run
```

## Create a new React project

```
> nx  generate @nrwl/react:library --directory=directory-name end-name --name=project-name --dry-run
```

## Create a new js project

```
> nx generate @nrwl/js:library --directory=todo --name=project-name --dry-run
```

## Delete project

```
> nx g @nrwl/workspace:remove project-name
```

## Move project

```
> nx g @nrwl/workspace:move --project project-name --destination new/path --dry-run
```

## Clean cache

```
> nx clear-cache
```

```
> nx reset
```

## Execute linter for all projects

```
> nx affected --target=lint
```

## Update node_modules

```
>> npm ci
```

## Update one package (on package.json):

```
>> npm i --save-exact my-package@1.2.2
```
