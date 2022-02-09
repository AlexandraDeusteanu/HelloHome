// const campground = require("../../models/campground");

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', 
center: campground.geometry.coordinates, 
zoom: 10 
});

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);

const popup = new mapboxgl.Popup({ closeOnClick: true })
.setLngLat(campground.geometry.coordinates)
.setHTML(`<h5>${campground.title}</h5>`)
.addTo(map);