const express = require('express');
const Auth = require('./auth-model');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../secret/index');
const jwt = require('jsonwebtoken');

async function checkRegisterCredentials(req, res, next) {
    const { username, password } = req.body;
    const user = await Auth.findByUsername(username);

    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' });
    } else if (user) {
        res.status(401).json({ message: 'username taken' });
    } else {
        next();
    }
};

async function checkLoginCredentials(req, res, next) {
    const username = req.body.username.trim();
    const password = req.body.password;
    const user = await Auth.findByUsername(username);

    if (!username || !password) {
        res.status(401).json({ message: 'username and password required' });
    } else if (!user || bcrypt.compareSync(password, user.password) === false) {
        res.status(401).json({ message: 'invalid credentials' });
    } else if (user && bcrypt.compareSync(password, user.password)) {
        const token = buildToken(user);
        req.username = user.username;
        req.password = user.password;
        req.token = token;
        next();
    } else {
        res.status(500).json({ message: 'uh oh, something went wrong logging in..' });
    }
};

function buildToken(user) {
    const payload = {
      subject: user.user_id,
      username: user.username,
      role_name: user.role_name
    };
  
    const config = {
      expiresIn: '1d'
    };
  
    return jwt.sign(payload, JWT_SECRET, config);
  };

module.exports = {
    checkRegisterCredentials,
    checkLoginCredentials
};