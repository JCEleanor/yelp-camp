const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

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

const sample = function(array) {
	return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
	await Campground.deleteMany({})
	for (let i = 0; i < 400; i++) {
		const random1000 = Math.floor(Math.random() * 1000)
		const camp = new Campground({
			author: '60b0c1b771f54252dee25393',
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			geometry: {
				type: 'Point',
				coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
			},
			images: [
				{
					url:
						'https://res.cloudinary.com/dwju5f11m/image/upload/v1622886954/Yelp-camp/c1etdoutqlcrrd6iigc0.jpg',
					filename: 'Yelp-camp/c1etdoutqlcrrd6iigc0'
				},
				{
					url:
						'https://res.cloudinary.com/dwju5f11m/image/upload/v1622699779/Yelp-camp/wj2qhcfmrdvf9kymkn0j.jpg',
					filename: 'Yelp-camp/wj2qhcfmrdvf9kymkn0j'
				}
			],
			description:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quam, eius consectetur itaque officia nostrum molestias animi ipsum aliquam commodi blanditiis veritatis necessitatibus facilis perspiciatis modi vitae voluptatibus dolor eligendi.',
			price: Math.floor(Math.random() * 20) + 10
		})
		await camp.save()
	}
}

seedDB().then(() => {
	mongoose.connection.close()
})
