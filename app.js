// if (process.env.NODE_ENV !== 'production') {
// 	require('dotenv').config()
// }
require('dotenv').config()
// dont display the error stack outside of development
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
//express async error handling function
const ExpressError = require('./utilities/ExpressError')
//override method
const methodOverride = require('method-override')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const User = require('./models/user')

//require routes
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const authenticationRoutes = require('./routes/authentication')
//
//url to connect to mongodb atlas
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
// 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
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
//ejs-mate
app.engine('ejs', ejsMate)

//to parse the req.body
app.use(express.urlencoded({ extended: true }))

//method-override
app.use(methodOverride('_method'))

//prevent mongo injection
app.use(
	mongoSanitize({
		replaceWith: '_'
	})
)

//config session
const sessionConfig = {
	name: 'yelpcampSession',
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
//add flash messages
app.use(flash())

//for passport.js
app.use(passport.initialize())
//to get persistent login status. MUST be AFTER session
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
//the way data is stored/unstored in the session
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//sending flash messages, must put before route handlers
app.use((req, res, next) => {
	// console.log(req.session);

	//to check which user
	res.locals.currentUser = req.user

	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})

app.use(helmet({ contentSecurityPolicy: false }))
//use routes
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)
app.use('/', authenticationRoutes)

//serve static assets
app.use(express.static(path.join(__dirname, 'public')))

app.get('/fakeUser', async (req, res) => {
	const user = new User({ email: 'haha@gmail.com', username: 'Emy' })
	const newUser = await User.register(user, '123')
	res.send(newUser)
})

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
})

app.listen(3000, () => {
	console.log('ON PORT 3000')
})
