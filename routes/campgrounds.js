const express = require('express')
const router = express.Router()

//middleware that checks if users are loggin
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')

//require controllers
const campgrounds = require('../controllers/campgrounds')

//expression async error handling function
const catchAsync = require('../utilities/catchAsync')

//all campgrounds
router.get('/', catchAsync(campgrounds.index))

//make new campground page
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//add new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

//show campground details
router.get('/:id', catchAsync(campgrounds.showCampground))

//edit campground page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//update campground
router.put('/:id', validateCampground, isAuthor, catchAsync(campgrounds.updateCampgorund))

//delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router
