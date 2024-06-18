const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const {validateListing, isLoggedIn, isOwner} = require("../middleware.js")
const listingController = require('../controllers/listing.js')
const multer = require("multer")
const { storage } = require('../cloudConfig.js')
const upload = multer({storage})

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.newListing))

router.route("/new")
    .get(isLoggedIn, listingController.newListingForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isOwner, isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.editListing))
    .delete(isOwner, isLoggedIn, wrapAsync(listingController.deleteListing))

router.route("/:id/edit")
    .get(isOwner, isLoggedIn, wrapAsync(listingController.editListingForm))

module.exports = router