const knex = require('knex');

const dbconfig = require('./knexfile');
let testDb = knex(dbconfig);

module.exports = function() {
    return testDb.migrate.latest();
}