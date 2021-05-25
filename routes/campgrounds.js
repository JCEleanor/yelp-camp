const express = require('express')
const router = express.Router()

//import joi from schemas.js
const { campgroundSchema, reviewSchema } = require('../schemas')

const ExpressError = require('../utilities/ExpressError')

//require the models
const Campground = require('../models/campground')
const Review = require('../models/reviews')

//expression async error handling function
const catchAsync = require('../utilities/catchAsync')

//campground valiation middleware
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if (error) {
		const strErrorMsg = error.details.map((el) => el.message).join(',')
		throw new ExpressError(strErrorMsg, 400)
	} else {
		next()
	}
}

//review validation middleware
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body)
	if (error) {
		const strErrorMsg = error.details.map((el) => el.message).join(',')
		throw new ExpressError(strErrorMsg, 400)
	} else {
		next()
	}
}

//all campgrounds
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({})
		res.render('campgrounds/index', { campgrounds })
	})
)

//make new campground page
router.get('/new', (req, res) => {
	res.render('campgrounds/new')
})

//add new campground
router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground)
		await campground.save()
		res.redirect(`campgrounds/${campground._id}`)
	})
)

//show campground details
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id).populate('reviews')
		// console.log(campground);
		res.render('campgrounds/show', { campground })
	})
)

//edit campground page
router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
		res.render('campgrounds/edit', { campground })
	})
)

//edit campground
router.put(
	'/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
		res.redirect(`/campgrounds/${campground._id}`)
		// not "campground/${campground._id"
	})
)

//delete campground
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params
		await Campground.findByIdAndDelete(id)
		res.redirect('/campgrounds')
	})
)

//add review
router.post(
	'/:id/reviews',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id)
		const review = new Review(req.body.review)
		campground.reviews.push(review)
		await review.save()
		await campground.save()
		res.redirect(`/campgrounds/${campground._id}`)
	})
)

//delete review
router.delete(
	'/:id/reviews/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params
		await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
		await Review.findByIdAndDelete(reviewId)
		res.redirect(`/campgrounds/${id}`)
	})
)

module.exports = router
