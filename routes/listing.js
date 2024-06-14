const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema}= require('../schema.js')
const Listing = require("../models/listing.js")

// Listing Schema Validation
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(", ")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

// All Listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("./listings/index.ejs", { allListings })
}))

// Create New Listing
router.get("/new", (req, res) => {
    res.render("./listings/new.ejs")
})

router.post("/", validateListing, wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body)
    await newListing.save();
    res.redirect("/listings")
}))

// Show Listing
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id).populate("reviews")
    res.render("./listings/show.ejs", {thisListing})
}))

// Edit Listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params
    const thisListing = await Listing.findById(id)
    res.render("./listings/edit.ejs", {thisListing})
}))

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    if(!req.body) {
        throw new ExpressError(400, "Send valid data for listing")
    }
    let {id} = req.params
    await Listing.findByIdAndUpdate(id, {...req.body})
    res.redirect("/listings")
}))

// Delete Listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))

module.exports = router