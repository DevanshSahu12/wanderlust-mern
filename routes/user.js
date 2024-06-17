const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const passport = require('passport')
const { saveRedirectUrl } = require('../middleware.js')
const userController = require('../controllers/user.js')

// Signup
router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup))

// Login
router.route("/login")
    .get(userController.loginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/user/login', failureFlash: true}), wrapAsync(userController.login))

// Logout
router.route("/logout")
    .get(userController.logout)

module.exports = router