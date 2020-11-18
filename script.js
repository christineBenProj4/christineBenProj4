

// declaring namespace
const mapApp = {};

// global variables 
mapApp.apiKey ='Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';
mapApp.searchUrl='http://www.mapquestapi.com/search/v2/radius';
mapApp.mapUrl= 'https://www.mapquestapi.com/staticmap/v5/map';
mapApp.units = 'wmin';
mapApp.radius = '15';
mapApp.origin = '483 Queen St W 3rd floor, Toronto, ON M5V 2A9';
mapApp.lat = '59.566601';
mapApp.long = '-98.6166';

// map initializing function required to use leaflet and mapquest methods and for visually displaying map on page
mapApp.mapInit = () => {
    // the following was copied from the Mapquest API docs for displaying dynamic maps on the page.
    L.mapquest.key = mapApp.apiKey;

    // 'map' refers to a <div> element with the ID map
    const map = new L.mapquest.map('map', {
        center: [mapApp.lat, mapApp.long],
        layers: L.mapquest.tileLayer('map'),
        zoom: 4
    });

    // getinfo() is the ajax request
    // calling it in mapInit(); so we can use the ajax returns with mapquest/leaflet methods, which can only be used within the mapInit(); function
    // leaflet methods: https://leafletjs.com/reference-1.3.4.html#map-methods-for-layers-and-controls
    mapApp.getInfo();

    // function to pan to user based off of ajax request and zoom in 
    mapApp.panToUser = () => {
        map.panTo([mapApp.searchDataLat, mapApp.searchDataLong]);
        map.setZoom(15);
    }

    // function to add markers on map based off of ajax request
    // takes two params, lat and long 
    mapApp.addMarkers = (lat, long) => {
        new L.marker([lat, long]).addTo(map);
    }
}
// end of map initalize function

// ajax request to get info 
mapApp.getInfo = (function () {
    // firing the ajax query on a button click
    $('.submitButton').on('click', function () {
        $.ajax({
            url: mapApp.searchUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                // calling the data parameters in the order that 
                // is on the website
                key: mapApp.apiKey,
                origin: mapApp.origin,
                radius: mapApp.radius,
                units: mapApp.units,
            }
        }).then(function (searchData) {
            console.log(searchData);

            mapApp.searchDataLat = searchData.origin.latLng.lat;
            mapApp.searchDataLong = searchData.origin.latLng.lng;

            // creating array to hold all the search results 
            mapApp.searchDataPois = searchData.searchResults;
            
            // calling func to move center point of map that is declared in mapinit
            mapApp.panToUser();

            // iterating through each place of interest (poi) 
            mapApp.searchDataPois.forEach(poi => {

                // messing around 
                if (poi.fields.group_sic_code_name_ext === "(all) Restaurants") {
                    console.log("name:", poi.name, "sic code", poi.fields.group_sic_code_name_ext)

                    // calling marker func that is declared in mapinit
                    mapApp.addMarkers(poi.fields.lat, poi.fields.lng);
                }
            });            
        })
    })
})


mapApp.init = () => {
    console.log('init!');
    mapApp.mapInit();
}

// Christine's shit from last night:
// namespace
// const mapApp = {};

// mapApp.apiKey = 'Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';
// mapApp.searchUrl = 'http://www.mapquestapi.com/search/v2/radius';
// mapApp.origin = '1504 Victoria Ave Saskatoon SK';


// mapApp.searchResults = function() {
//     $.ajax({
//     url: mapApp.searchUrl,
//     method: 'GET',
//     dataType: 'json',
//     data: {
//         origin: mapApp.origin,
//         key: mapApp.apiKey,
//     }
// }).then(function(results) {
//     console.log(results);
//     mapApp.userLat = results.origin.latLng.lat;
//     mapApp.userLong = results.origin.latLng.lng;
    

// L.mapquest.key = mapApp.apiKey;

// // 'map' refers to a <div> element with the ID map
// L.mapquest.map('map', {
//   center: [mapApp.userLat, mapApp.userLong],
//   // L.mapquest.tileLayer('map') is the MapQuest map tile layer
//   layers: L.mapquest.tileLayer('map'),
//   zoom: 12
// });


// })
// };


// mapApp.init = function() {
//     console.log('init');
//     mapApp.searchResults();
// };

$(function() {
    console.log('ready!');
    mapApp.init();
})