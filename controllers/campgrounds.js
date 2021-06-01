const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res) => {
	const campground = new Campground(req.body.campground)
	campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }))
	//associate currently login user as author
	campground.author = req.user._id
	await campground.save()
	console.log(campground)
	req.flash('success', 'Successfully added a new campground')
	res.redirect(`campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
		.populate({ path: 'reviews', populate: { path: 'author' } })
		.populate('author')

	if (!campground) {
		req.flash('error', 'campground does not exist')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	if (!campground) {
		req.flash('error', 'campground does not exist')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/edit', { campground })
}

module.exports.updateCampgorund = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
	req.flash('success', 'Successfully updated a campground')
	res.redirect(`/campgrounds/${campground._id}`)
	// not "campground/${campground._id"
}

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params
	await Campground.findByIdAndDelete(id)
	req.flash('success', 'Successfully deleted a campground')
	res.redirect('/campgrounds')
}
