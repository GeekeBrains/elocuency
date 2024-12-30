## Folder skeletor
If create a barrel index global for each module we have this error:  ERROR [ExceptionHandler] Cannot read properties of undefined (reading 'name')

We create a barrel index for each module/type: ex: "elo-bff/users/controller"
Not create a "elo-bff/user" -> This produce ciclic dependency problems a "Cannot read properties of undefined (reading 'name')" 