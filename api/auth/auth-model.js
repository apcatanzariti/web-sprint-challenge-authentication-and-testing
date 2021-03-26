const db = require('../../data/dbConfig');

function findByUsername(username) {
    return db('users').where({ username }).first();
};

function findById(id) {
    return db('users').where({ id }).first();
};

async function add(user) {
    const [id] = await db('users').insert(user);

    return findById(id);
};

module.exports = {
    findByUsername,
    findById,
    add
};