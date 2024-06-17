const User = require('../models/user.js')

// Signup
module.exports.signupForm = (req, res) => {
    res.render('./users/signup.ejs')
}
module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body

        let newUser = new User({email, username})
        let registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err)
            }
            req.flash("success", `Welcome new User!`)
            res.redirect('/listings')
        })
    } catch (err) {
        req.flash("error", err.message)
        res.redirect('/user/signup')
    }
}

// Login
module.exports.loginForm = (req, res) => {
    res.render('./users/login.ejs')
}
module.exports.login = async (req, res) => {
    req.flash("success", "Logged in!")
    const redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

// Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next()
        }
        req.flash("success", "You have logged out!")
        res.redirect("/listings")
    })
}