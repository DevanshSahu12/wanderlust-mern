const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js")
const listingController = require('../controllers/listing.js')

// All
router.get("/", wrapAsync(listingController.index))

// New
router.get("/new", isLoggedIn, listingController.newListingForm)
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.newListing))

// Show
router.get("/:id", wrapAsync(listingController.showListing))

// Edit
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.editListingForm))
router.put("/:id", isOwner, isLoggedIn, validateListing, wrapAsync(listingController.editListing))

// Delete
router.delete("/:id", isOwner, isLoggedIn, wrapAsync(listingController.deleteListing))

module.exports = router