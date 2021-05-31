const express = require('express')
const router = express.Router()

//middleware that checks if users are loggin
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')

//require controllers
const campgrounds = require('../controllers/campgrounds')

//expression async error handling function
const catchAsync = require('../utilities/catchAsync')

router
	.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router
	.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(validateCampground, isAuthor, catchAsync(campgrounds.updateCampgorund))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router
