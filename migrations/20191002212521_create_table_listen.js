exports.up = function(knex, Promise) {
    return knex.schema.createTable('listen', (table) => {
        table.increments('id').primary();
        table.string('userId')
        table.string('musicId')
      }
    );
  };
  
exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('listen');
};
  