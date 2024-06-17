const {listingSchema}= require('./schema.js')
const ExpressError = require("./utils/ExpressError.js")
const {reviewSchema} = require('./schema.js')

// Listing Schema Validation
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(", ")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

// Review Schema Validation
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

// Login Check
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be logged in to create a new listing")
        return res.redirect("/user/login")
    }
    next()
}

// Redirect
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}