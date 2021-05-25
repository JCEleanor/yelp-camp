const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
//import joi from schemas.js
const { campgroundSchema, reviewSchema } = require('./schemas')
//expression async error handling function
const catchAsync = require('./utilities/catchAsync')
const ExpressError = require('./utilities/ExpressError')
//override method
const methodOverride = require('method-override')
//require the models
const Campground = require('./models/campground')
const Review = require('./models/reviews')
//require routes
const campgrounds = require('./routes/campgrounds')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
	console.log('Database connected')
})

const app = express()

//set ejs view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//to parse the req.body
app.use(express.urlencoded({ extended: true }))

//method-override
app.use(methodOverride('_method'))

//
app.use('/campgrounds', campgrounds)

//ejs-mate
app.engine('ejs', ejsMate)

//homepage
app.get('/', (req, res) => {
	res.render('home')
})

//for every single request, if it doesn't hit the routes above, it'd hit this route, so the order is IMPORTANT
app.all('*', (req, res, next) => {
	next(new ExpressError('page not found', 404))
})

//error handling middleware
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err
	if (!err.message) err.message = 'oh no something went wrong'
	res.status(statusCode).render('error', { err })
	// console.log(err);
})

// app.get('/makecampground', async(req, res) => {
//     const camp = new Campground({title: 'My Backyard', description: 'cheap camping'});
//     await camp.save();
//     res.send(camp)
// })

app.listen(3000, () => {
	console.log('ON PORT 3000')
})
