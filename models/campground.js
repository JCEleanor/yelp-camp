const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./reviews')

const ImageSchema = new Schema({
	url: String, //req.file.path
	filename: String //req.file.filename
})
ImageSchema.virtual('thumbnail').get(function() {
	return this.url.replace('/upload', '/upload/w_200')
})
const CampgroundSchema = new Schema({
	title: String,
	price: Number,
	images: [ ImageSchema ],
	geometry: {
		type: {
			type: String,
			enum: [ 'Point' ],
			required: true
		},
		coordinates: {
			type: [ Number ],
			required: true
		}
	},
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
