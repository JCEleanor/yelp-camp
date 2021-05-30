const express = require('express')
//set mergeParams to true, so we can get the :id, otherwise we will get a "Cannot read property 'reviews' of null" error, which arise from the fact that req.params is (the id) is an empty object
const router = express.Router({ mergeParams: true })
//error handling
const catchAsync = require('../utilities/catchAsync')

//require the models
const Campground = require('../models/campground')
const Review = require('../models/reviews')

const {validateReview} = require('../middleware')

//add review
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		//if mergeParams is not set (false), req.params would be an empty object
		// console.log(req.params)
		const campground = await Campground.findById(req.params.id)
		const review = new Review(req.body.review)
		campground.reviews.push(review)
		await review.save()
		await campground.save()
		req.flash('success', 'Successfully leave a new review')
		res.redirect(`/campgrounds/${campground._id}`)
	})
)

//delete review
router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params
		await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
		await Review.findByIdAndDelete(reviewId)
		req.flash('success', 'Successfully deleted a review')

		res.redirect(`/campgrounds/${id}`)
	})
)

module.exports = router
