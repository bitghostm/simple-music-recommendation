const knex = require('knex');
const app = require('./dist/index');

const dbconfig = require('./knexfile');
let testDb = knex(dbconfig);

module.exports = function() {
    return testDb.migrate.rollback();
}
