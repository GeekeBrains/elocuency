# Next JS
We use v14 in this moment with the new App Router.

## CSS
We use modules.css.
For css with params use styled Components.

Avoid another libraries like talwind, etc for be more easy the onboarding for new people, css is stadard, and avoid migration of versions. 

## Code organization
The actions and use cases should be on slides, only local actions and detalils irrelevant forn the use case are on components.

See order to put handlers and pure functions:  
https://andreipfeiffer.dev/blog/2021/react-components-anatomy

- I always use function declarations instead of function expressions because they are hoisted, which allows me to define them after their usage. This wayI can place them at the end of the component function, after the return statement;
- If a function calls another function, I always place the caller before the callee.
- I usually put these functions in the order of their usage.