const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
//express async error handling function
const catchAsync = require('../utilities/catchAsync')
//middleware that checks if users are loggin
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router
	.route('/')
	.get(catchAsync(campgrounds.index))
	// .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
	.post(upload.single('image'), (req, res) => {
		console.log(req.body, req.file)
		res.send('files sent')
	})

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router
	.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(validateCampground, isAuthor, catchAsync(campgrounds.updateCampgorund))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router
