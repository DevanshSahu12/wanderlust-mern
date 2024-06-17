const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const User = require('../models/user.js')
const passport = require('passport')
const { saveRedirectUrl } = require('../middleware.js')

// Signup
router.get('/signup', (req, res) => {
    res.render('./users/signup.ejs')
})

router.post('/signup', wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body

        let newUser = new User({email, username})
        let registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err)
            }
            req.flash("success", "Welcome new User!")
            res.redirect('/listings')
        })
    } catch (err) {
        req.flash("error", err.message)
        res.redirect('/user/signup')
    }
}))

// Login
router.get('/login', (req, res) => {
    res.render('./users/login.ejs')
})

router.post('/login', saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/user/login', failureFlash: true}), wrapAsync(async (req, res) => {
    req.flash("success", "Logged in!")
    res.redirect(res.locals.redirectUrl)
}))

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next()
        }
        req.flash("success", "You have logged out!")
        res.redirect("/listings")
    })
})

module.exports = router