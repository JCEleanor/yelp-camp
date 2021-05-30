const express = require('express')
const passport = require('passport')
const { Error } = require('mongoose')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/authentication')

router.get('/register', users.renderRegisterForm)

router.post('/register', catchAsync(users.registerUser))

router.get('/login', users.renderLoginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router
