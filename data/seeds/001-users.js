const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  return knex('users')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'frodo', password: bcrypt.hashSync('1234', 8)},
        {username: 'bilbo', password: bcrypt.hashSync('1234', 8)},
        {username: 'samwise', password: bcrypt.hashSync('1234', 8)}
      ]);
    });
};
