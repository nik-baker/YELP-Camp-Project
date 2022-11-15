const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport')

const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')


// This Renders the Register Form & Registers you
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

// This Renders the Login Form & Logs you in 
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)

// This Logs you out 
router.get('/logout', users.logout)



module.exports = router;