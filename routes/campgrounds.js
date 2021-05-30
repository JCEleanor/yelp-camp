const express = require('express')
const router = express.Router()

//middleware that checks if users are loggin 
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')

//require the models
const Campground = require('../models/campground')
//expression async error handling function
const catchAsync = require('../utilities/catchAsync')


//all campgrounds
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({})
		res.render('campgrounds/index', { campgrounds })
	})
)

//make new campground page
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new')
})

//add new campground
router.post(
	'/', isLoggedIn, 
	validateCampground,
	catchAsync(async (req, res) => {
		const campground = new Campground(req.body.campground)
		//associate currently login user as author
		campground.author = req.user._id
		await campground.save()
		req.flash('success', 'Successfully added a new campground')
		res.redirect(`campgrounds/${campground._id}`)
	})
)

//show campground details
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findById(id).populate('reviews').populate('author')
		
		if (!campground) {
			req.flash('error', 'campground does not exist')
			return res.redirect('/campgrounds')
		}
		res.render('campgrounds/show', { campground })
	})
)

//edit campground page
router.get(
	'/:id/edit', isLoggedIn, isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findById(id)
		if (!campground) {
			req.flash('error', 'campground does not exist')
			return res.redirect('/campgrounds')
		}
		res.render('campgrounds/edit', { campground })
	})
)

//update campground
router.put('/:id',
	validateCampground, isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params
		const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
		req.flash('success', 'Successfully updated a campground')
		res.redirect(`/campgrounds/${campground._id}`)
		// not "campground/${campground._id"
	})
)

//delete campground
router.delete(
	'/:id', isLoggedIn, isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params
		await Campground.findByIdAndDelete(id)
		req.flash('success', 'Successfully deleted a campground')
		res.redirect('/campgrounds')
	})
)

module.exports = router
