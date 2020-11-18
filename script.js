
// namespace
const mapApp = {};

mapApp.apiKey = 'Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';
mapApp.searchUrl = 'http://www.mapquestapi.com/search/v2/radius';
mapApp.origin = '1504 Victoria Ave Saskatoon SK';


mapApp.searchResults = function() {
    $.ajax({
    url: mapApp.searchUrl,
    method: 'GET',
    dataType: 'json',
    data: {
        origin: mapApp.origin,
        key: mapApp.apiKey,
    }
}).then(function(results) {
    console.log(results);
    mapApp.userLat = results.origin.latLng.lat;
    mapApp.userLong = results.origin.latLng.lng;
    

L.mapquest.key = mapApp.apiKey;

// 'map' refers to a <div> element with the ID map
L.mapquest.map('map', {
  center: [mapApp.userLat, mapApp.userLong],
  // L.mapquest.tileLayer('map') is the MapQuest map tile layer
  layers: L.mapquest.tileLayer('map'),
  zoom: 12
});


})
};


mapApp.init = function() {
    console.log('init');
    mapApp.searchResults();
};

$(function() {
    console.log('ready!');
    mapApp.init();
})