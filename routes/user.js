const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require("../utils/ExpressError.js")
const User = require('../models/user.js')
const passport = require('passport')

// Signup
router.get('/signup', (req, res) => {
    res.render('./users/signup.ejs')
})

router.post('/signup', wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body

        let newUser = new User({email, username})
        let registeredUser = await User.register(newUser, password)
        req.flash("success", "Welcome new User!")
        res.redirect('/listings')
    } catch (err) {
        req.flash("error", err.message)
        res.redirect('/user/signup')
    }
}))

// Login
router.get('/login', (req, res) => {
    res.render('./users/login.ejs')
})

router.post('/login', passport.authenticate("local", {failureRedirect: '/user/login', failureFlash: true}), wrapAsync(async (req, res) => {
    req.flash("success", "Logged in!")
    res.redirect('/listings')
}))

module.exports = router