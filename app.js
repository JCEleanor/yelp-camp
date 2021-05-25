const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')

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
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	//to prevent warning message: DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated.
	useFindAndModify: false
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

//config session
const sessionConfig = {
	secret: 'thisisasecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		//extra security, to prevent cross-site scripting flaws, by default it's true
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires after 7 days
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
//this MUST come BEFORE campgrounds/reviews routes
app.use(session(sessionConfig))

//require campground routes
app.use('/campgrounds', campgrounds)
//require review routes
app.use('/campgrounds/:id/reviews', reviews)
//serve static assets
app.use(express.static(path.join(__dirname, 'public')))

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
