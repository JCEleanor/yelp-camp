//import joi from schemas.js
const { campgroundSchema, reviewSchema } = require('./schemas')
const Campground = require('./models/campground')
const Review = require('./models/reviews')
const ExpressError = require('./utilities/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl
		req.flash('error', 'You must be signed in')
		//return, otherwiser the code below will still run
		return res.redirect('/login')
	}
	next()
}

//campground valiation middleware
module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body)
	if (error) {
		const strErrorMsg = error.details.map((el) => el.message).join(',')
		throw new ExpressError(strErrorMsg, 400)
	} else {
		next()
	}
}

//authorization middleware for review author
module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	if (!campground.author.equals(req.user._id)) {
		req.flash('error', 'No permission')
		return res.redirect(`/campgrounds/${id}`)
	}
	next()
}

//authorization middleware for review author
module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params
	const review = await Review.findById(reviewId)
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'No permission')
		return res.redirect(`/campgrounds/${id}`)
	}
	next()
}

//review validation middleware
module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body)
	if (error) {
		const strErrorMsg = error.details.map((el) => el.message).join(',')
		throw new ExpressError(strErrorMsg, 400)
	} else {
		next()
	}
}
