const express = require('express')
//set mergeParams to true, so we can get the :id, otherwise we will get a "Cannot read property 'reviews' of null" error, which arise from the fact that req.params is (the id) is an empty object
const router = express.Router({ mergeParams: true })

const reviews = require('../controllers/reviews')
//error handling
const catchAsync = require('../utilities/catchAsync')

//require the models
const Campground = require('../models/campground')
const Review = require('../models/reviews')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

//add review
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

//delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router
