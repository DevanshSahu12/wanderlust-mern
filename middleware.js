const {listingSchema}= require('./schema.js')
const ExpressError = require("./utils/ExpressError.js")
const {reviewSchema} = require('./schema.js')
const Listing = require('./models/listing.js')

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

// Authorize Delete and Edit
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', "You don't have the permission")
        res.redirect(`/listings/${id}`)
    }
    next()
}