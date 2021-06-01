const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./reviews')

const CampgroundSchema = new Schema({
	title: String,
	price: Number,
	images: [
		{
			url: String, //req.file.path
			filename: String //req.file.filename
		}
	],
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
})

//the middleware that's gonna be triggered when we hit the 'findByIdAndUpdate' route
CampgroundSchema.post('findOneAndDelete', async function(doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		})
	}
})

module.exports = mongoose.model('Campground', CampgroundSchema)
