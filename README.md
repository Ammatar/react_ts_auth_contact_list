node -v v16.13.2

# command to build frontend, gather all node_modules and run server (API and serve frontend) on localhost:3010

from project root folder: npm --prefix ./server run deploy

## frontend(React, Mobx, Typescript)

Made as React SPA with a conditional rendering, all fetch requests are located in State manager(frontend/src/store - Mobx)

## backend(Express, sequelize)

Based on Express framework with sqlite3 database controlled by sequelize ORM.
Seeded with: login - admin, password - qwerty and login - user, password - qwerty
