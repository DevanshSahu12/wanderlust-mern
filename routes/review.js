const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')
const reviewController = require('../controllers/review.js')

router.route("/")
    .post(isLoggedIn, validateReview, wrapAsync(reviewController.newReview))

router.route("/:reviewId")
    .delete(isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router