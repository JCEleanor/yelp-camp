const express = require('express')
const passport = require('passport')
const { Error } = require('mongoose')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utilities/catchAsync')

router.get('/register', (req, res) => {
    res.render('authentication/register')
})

router.post('/register', catchAsync(async(req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.flash('success', 'Welcome to Yelp Camp')
        res.redirect('/campgrounds')
    } catch(err) {
        req.flash('error', err.message)
        console.log(err);
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('authentication/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect:'/login' }), (req, res) => {
    req.flash('success', 'Welcome back')
    res.redirect('/campgrounds')
})

module.exports = router