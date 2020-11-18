// AAAAAAAAHHHHHHHH!!!!!!!!!!!!!

const mapApp = {};

mapApp.apiKey ='Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';

mapApp.searchUrl='http://www.mapquestapi.com/search/v2/radius';

mapApp.mapUrl= 'https://www.mapquestapi.com/staticmap/v5/map';

mapApp.units = 'wmin';
mapApp.radius = '15';
mapApp.origin = '483 Queen St W 3rd floor, Toronto, ON M5V 2A9';
mapApp.lat = '59.566601';
mapApp.long = '-98.6166';




mapApp.getInfo = (function() {
    $.ajax({
        url: mapApp.searchUrl,
        method: 'GET',
        dataType: 'json',
        origin: mapApp.origin,
        data: {
            units: mapApp.units,
            radius: mapApp.radius,
            key: mapApp.apiKey,
        }
    }).then(function(searchData) {
        console.log(searchData);
        
    })
})



// the following was copied from the Mapquest API docs for displaying dynamic maps on the page.
L.mapquest.key = 'Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';

// 'map' refers to a <div> element with the ID map
L.mapquest.map('map', {
    center: [mapApp.lat, mapApp.long],
    layers: L.mapquest.tileLayer('map'),
    zoom: 4

});



mapApp.init = () => {
    console.log('init!');
    mapApp.getInfo();
}


$(function() {
    console.log('ready!');
    mapApp.init();

})