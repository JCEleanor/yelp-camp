//what's passed from the server side:
//const campground = {"geometry":{"coordinates":[139.77,35.68],"type":"Point"},"reviews":[],"_id":"60b706888213781b0db610e9","title":"Tokyo Tent","location":"Tokyo","price":20,"description":"Tokyo Tent","images":[{"_id":"60b706888213781b0db610ea","url":"https://res.cloudinary.com/dwju5f11m/image/upload/v1622607495/Yelp-camp/cemzayuziwbtm8jujm73.jpg","filename":"Yelp-camp/cemzayuziwbtm8jujm73"}],"author":{"_id":"60b0edfcae669454b75f0d8d","email":"crcky4826@gmail.com","username":"eleanor","__v":0},"__v":0}

mapboxgl.accessToken = mapboxToken
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	// center: [ 120.9605, 23.6978 ], // starting position [lng, lat]
	zoom: 9 // starting zoom
})

map.addControl(new mapboxgl.NavigationControl())

// new mapboxgl.marker().setLngLat([-74.5, 40]).addTo(map)
const marker1 = new mapboxgl.Marker()
	.setLngLat(campground.geometry.coordinates)
	.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h2><p>${campground.location}</p>`))
	.addTo(map)
