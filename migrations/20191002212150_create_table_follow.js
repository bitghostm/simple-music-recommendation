exports.up = function(knex, Promise) {
  return knex.schema.createTable('follow', (table) => {
      table.increments('id').primary();
      table.string('userId')
      table.string('followerId')
    }
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('follow');
};
