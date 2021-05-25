const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const CampgroundSchema = new Schema({
	title: String,
	price: Number,
	image: String,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

//the middleware that's gonna be triggered when we hit the 'findByIdAndUpdate' route
CampgroundSchema.post('findOneAndDelete', async function(doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews
			}
		});
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);
