# Naming

Must be intuitive, natural, easy and descriptive.
https://github.com/standard/standard

https://google.github.io/styleguide/jsguide.html

## Files and folders

Files for Classes or Modules equal to main name.
Files for functions equal to main function.
All folders on kebab-case.

## camelCase

- All vars.
- Fields of tables.
- Functions.
- Files that export functions, the same like function name.
- Css names.

## PascalCase

- Classes.
- Tables.
- React components.
- Their folders.
- Model folders.
- NextJs / React

## kebab-case

- All folders on kebab-case.
- NextJs pages must named: page.tsx
- NextJs pages Directory: Files inside the pages directory typically mirror the URL paths they represent.
- Index Files: index.ts
- Public Directory
  Static assets like images, fonts, and static files in the public directory should generally be named in lowercase.
- Styles Files
  If using CSS Modules, which are scoped locally to the component, the file names often mirror the component names but in lowercase and using kebab-case, such as user-profile.module.css or shopping-cart.module.scss.
  For global styles, a clear descriptor like globals.css or app-styles.scss is common.
- API Routes
  Files within the pages/api directory should also be in lowercase to align with URL conventions, e.g., send-email.js.

Consistency is Key: The most important aspect is to be consistent across the project. If you choose a naming convention, stick to it throughout all directories and file types.

Consistency by context:
Context Develop vs context DevOps (aws)

Clear and Descriptive: Names should be intuitive and descriptive of their functionality or the component they represent, which improves readability and maintainability of the codebase.

Avoid Special Characters: Stick to alphanumeric characters and simple dashes or underscores if necessary. Avoid spaces and other special characters that might be misinterpreted by browsers or servers.

## CSS

BEM Style (Block Element Modifier)
To separated word "-".

/_ Block _/
.button { ... }

/_ Element _/
.button\_\_icon { ... }

/_ Modifier _/
.button--large { ... }

## AWS objects

kebab case style.

Enviroment: "dev" | "prod" | "stg"
Proyect: "elo"

Recurso Nomenclatura Ejemplo
Lambda {proyecto}-{entorno}-{función} orderApp-prod-processOrder
DynamoDB {proyecto}-{entorno}-{tabla} ecommerce-prod-Orders
SQS {proyecto}-{entorno}-{cola} orderApp-prod-OrderQueue
SNS {proyecto}-{entorno}-{tema} orderApp-prod-OrderNotifications
S3 Bucket {empresa}-{proyecto}-{entorno}-{bucket} mycompany-ecommerce-prod-images
IAM Role {proyecto}-{entorno}-role-{descripcion} ecommerce-prod-role-OrderProcessing
Security Group {proyecto}-{entorno}-sg-{descripcion} ecommerce-prod-sg-AppSecurityGroup

Buenas Prácticas Adicionales

    1.	Prefijos o Sufijos: Usa prefijos (ddb, sqs, sns) para distinguir el tipo de recurso, especialmente si son visibles en AWS Console o si tienes múltiples recursos con nombres similares.
    2.	Entornos Separados: Especificar el entorno (dev, stg, prod) ayuda a evitar confusiones y errores, especialmente en entornos con múltiples etapas de desarrollo.
    3.	Nombres Descriptivos: Usa nombres descriptivos que indiquen el propósito del recurso. Esto facilita la administración y permite identificar rápidamente la función de cada recurso en la consola de AWS.
    4.	Mantén los Nombres Cortos y Útiles: Aunque es importante ser descriptivo, evita nombres excesivamente largos. Mantén los nombres lo suficientemente cortos para que sean legibles y fáciles de buscar en la consola.

## Abbreviations

Avoid by default, if its a recurrent long word, add to dictionary.
If finally we create it, first syllable + next syllabel first letter

## MyBlabla

To wrap a tipical tecnical lib, to make a wrapper, use "My" prefix.
Ex: MyLocalStorage, MyConsole

## currentBlabla

When a field that remark that have a value that change along time. Ex: currentChatId

# CSS

## Naming

Kebab case, because its the standar.

## Style

Use Id for a name for a unique element on the project. It has more performance.
Use class to reusable styles.

On react use module.css. This tecnique create unique names.
Use Id for unique element on components although this components its used more times.
