# Music Recommendation MVP
A simple muisc recommendation system implemented with Node.js, Express.js and PostgresSQL. 

## Pre-reqs
To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/)
- Install [PostgreSQL](https://www.postgresql.org//)
- Install [Yarn](https://yarnpkg.com/lang/en/docs/install/) 

## Getting started
- Install dependencies
```
yarn install
```
- Start your Postgres server 
```
brew services start postgresql
```
- Create and migrate DB
```
createdb recommendation
createdb recommendation_test
yarn db:migrate

```
- Start API server
```
yarn build
yarn start
```

## Scripts
- `yarn start` - serves the app on `localhost` in watch mode
- `yarn run build` - builds the project, the out directory is `/dist`
- `yarn db:migrate` - updates the database with the latest migrations (an alias for `knex migrate:latest`),
- `yarn db:rb` - rollbacks last migrations (an alias for `knex migrate:rollback`),
- `yarn db:mc migration_name` - creates a new migration file named `migration_name` (an alias for `knex migrate:make`)
- `yarn test test_name` - runs specific test or runs all tests if `test_name` isn't provided (there are three tests: follow, listen, recommendation)
