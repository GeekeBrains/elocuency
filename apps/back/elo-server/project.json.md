# Change outputPath to workspaceRoot

TODO: nx error
"outputPath" works wrong on nx, dont works with: "outputPath": "{workspaceRoot}/.tmp/apps/back/elo-bff",
and works diferent on build agains serve ?!?!?!

On nx v19.6.3 if you like to send build path to workspace root changing project.json:
"outputPath": "{workspaceRoot}/.tmp/apps/back/elo-bff"
the build works, but the serve, try to get from projectRoot.
only works both in this way:
"outputPath": "{projectRoot}/.tmp/apps/back/elo-bff"
