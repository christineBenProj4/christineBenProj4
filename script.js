
// namespace
const mapApp = {};

mapApp.apiKey = 'Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';
mapApp.searchUrl = 'http://www.mapquestapi.com/search/v2/radius';
mapApp.origin = '1931 Nelson St Vancouver BC';


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