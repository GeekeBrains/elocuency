# .nx

Nx monorepo working folder, can't be config.
Don't up to git.

# .tmp

This folder can be deleted in any moment.
Don't up to git.

## .tmp/apps

All builds are generated here.

### /.tmp/apps/local

Builds for dev on local purpoise.

### /.tmp/apps/local/back/...Agent

### /.tmp/apps/local/front/nextjs

### /.tmp/apps/prod

Builds for production purpoise.

### /.tmp/apps/staging

Builds for staging purpoise. Pre-production enviroment.

# Apps

Where make final builds on distint enviroments, with the code of /Libs.
Only the code to adapter to especific tecnology, ex: Capacitor and NextJs can use the same code to make diferent builds, here only must be the esential code to compile in this technology.

# Libs

Code used to make all, clasified by front/back and technology: Typescript, React, Python, etc .
