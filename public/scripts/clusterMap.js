mapboxgl.accessToken = mapboxToken
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: [ 120.58, 23.58 ],
	zoom: 6
})

map.addControl(new mapboxgl.NavigationControl())

map.on('load', function() {
	map.addSource('campgrounds', {
		type: 'geojson',
		data: campgrounds,
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
	})

	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'campgrounds',
		filter: [ 'has', 'point_count' ],
		paint: {
			// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
			// with three steps to implement three types of circles:
			//   * Blue, 20px circles when point count is less than 100
			//   * Yellow, 30px circles when point count is between 100 and 750
			//   * Pink, 40px circles when point count is greater than or equal to 750
			'circle-color': [ 'step', [ 'get', 'point_count' ], '#51bbd6', 100, '#f1f075', 750, '#f28cb1' ],
			'circle-radius': [ 'step', [ 'get', 'point_count' ], 20, 15, 15, 20, 30 ]
		}
	})

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'campgrounds',
		filter: [ 'has', 'point_count' ],
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-font': [ 'DIN Offc Pro Medium', 'Arial Unicode MS Bold' ],
			'text-size': 12
		}
	})

	map.addLayer({
		id: 'unclustered-point',
		type: 'circle',
		source: 'campgrounds',
		filter: [ '!', [ 'has', 'point_count' ] ],
		paint: {
			'circle-color': '#11b4da',
			'circle-radius': 8,
			'circle-stroke-width': 1,
			'circle-stroke-color': '#fff'
		}
	})

	// inspect a cluster on click
	map.on('click', 'clusters', function(e) {
		const features = map.queryRenderedFeatures(e.point, {
			layers: [ 'clusters' ]
		})
		const clusterId = features[0].properties.cluster_id
		map.getSource('campgrounds').getClusterExpansionZoom(clusterId, function(err, zoom) {
			if (err) return

			map.easeTo({
				center: features[0].geometry.coordinates,
				zoom: zoom
			})
		})
	})

	map.on('click', 'unclustered-point', function(e) {
		const coordinates = e.features[0].geometry.coordinates.slice()
		const popupMarkup = e.features[0].properties.popupMarkup

		while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
			coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
		}

		new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupMarkup).addTo(map)
	})

	map.on('mouseenter', 'clusters', function() {
		map.getCanvas().style.cursor = 'pointer'
	})
	map.on('mouseleave', 'clusters', function() {
		map.getCanvas().style.cursor = ''
	})
})
