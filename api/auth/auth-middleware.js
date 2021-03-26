const Auth = require('./auth-model');
const bcrypt = require('bcryptjs');
const e = require('express');

async function checkLoginCredentials(req, res, next) {
    const username = req.body.username.trim();
    const password = req.body.password;

    const user = await Auth.findByUsername(username);

    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' });
    } else if (!user) {
        res.status(401).json({ message: 'invalid credentials' })
    } else if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        next();
    } else {
        res.status(500).json({ message: 'uh oh, something went wrong logging in..' });
    }
};

module.exports = {
    checkLoginCredentials
};