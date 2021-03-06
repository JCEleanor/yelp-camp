const Campground = require('../models/campground')
const Review = require('../models/reviews')

module.exports.createReview = async (req, res) => {
	//if mergeParams is not set (false), req.params would be an empty object
	// console.log(req.params)
	const campground = await Campground.findById(req.params.id)
	//db.products.find().forEach(function (doc){ d = doc._id.getTimestamp(); print(d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() ) })
	const review = new Review(req.body.review)
	review.author = req.user._id
	campground.reviews.push(review)
	await review.save()
	await campground.save()
	req.flash('success', 'Successfully leave a new review')
	res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params
	await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
	await Review.findByIdAndDelete(reviewId)
	req.flash('success', 'Successfully deleted a review')

	res.redirect(`/campgrounds/${id}`)
}
