

// declaring namespace
const mapApp = {};

// global variables
mapApp.apiKey ='Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';
mapApp.searchUrl='http://www.mapquestapi.com/search/v2/radius';
mapApp.directionUrl= 'http://open.mapquestapi.com/directions/v2/optimizedroute';
mapApp.units = '';
mapApp.radius = '';
mapApp.origin = '';
mapApp.lat = '59.566601';
mapApp.long = '-98.6166';
mapApp.markerArray = [];
mapApp.ambiguities = '';
mapApp.destAddress = [];

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
    mapApp.panToUser = (lat, lng) => {
        map.setZoom(15);
        map.panTo([lat, lng]);
        let group = new L.featureGroup(mapApp.markerArray);
        map.fitBounds(group.getBounds());
    }


    // function to add markers on map based off of ajax request
    // takes two params, lat and long
    mapApp.addMarkers = function(lat, long, name, address, city, phone)  {
        mapApp.marker = new L.marker([lat, long]);
        mapApp.markerArray.push(L.marker([lat, long]));
        map.addLayer(mapApp.marker);
        mapApp.marker.bindPopup(`
        <h4>${name}</h4>
        <h5 class="address">${address}</h5>
        <h5 class="city">${city}</h5>
        <h6>${phone}</h6>
        <button class="directionButton">Get Directions. fool!</button>
        `);
        // create array of marker addresses
        mapApp.destAddress.push(address);
        
    }
    mapApp.getDirections();

    // function to add popups to the map with earch result information
    mapApp.popup = function(html, position, options) {
        
    
    }


    // function to clear all previous markers on submit
    mapApp.clearMarkers = function() {
        $(".leaflet-marker-icon").remove();
        $(".leaflet-pane.leaflet-shadow-pane").css('display', 'none');
        mapApp.markerArray = [];
        mapApp.destAddress= [];
    }
}
// end of map initalize function

// ajax request to get info
mapApp.getInfo = (function () {
    // firing the ajax query on a button click
    $('.form').on('submit', function (e) {
        e.preventDefault(e);
       
        mapApp.origin = $('#origin').val();
        mapApp.radius = $('#radius').val();
        mapApp.units = $('input[name="units"]:checked').val();
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
                ambiguities: mapApp.ambiguities,
                // MapQuest API only allows for 500 or less results from ajax call
                maxMatches: 500,
                hostedData: 'mqap.ntpois|group_sic_code_ext LIKE?|581208'

            }
        }).then(function (searchData) {
            if (searchData.origin === undefined ) {
                alert('Please type in a REAL address safi');
                return;
            } else if (searchData.searchResults === undefined) {
                alert("You're going to need to walk farther!")
                return;
            }
            console.log(searchData);
            mapApp.searchDataLat = searchData.origin.latLng.lat;
            mapApp.searchDataLong = searchData.origin.latLng.lng;

            // creating array to hold all the search results
            mapApp.searchDataPois = searchData.searchResults;
            mapApp.clearMarkers();
            
            

            // iterating through each place of interest (poi)
            mapApp.searchDataPois.forEach(poi => {
                    // calling marker func that is declared in mapinit
                    mapApp.addMarkers(poi.fields.lat, poi.fields.lng, poi.fields.name, poi.fields.address, poi.fields.city, poi.fields.phone)
            // }
            });
           // calling func to move center point of map that is declared in mapinit
            mapApp.panToUser(mapApp.searchDataLat, mapApp.searchDataLong);
        })
    })
})

// ajax request to get info
mapApp.getDirections = (function () {
    // firing the ajax query on a button click
    $('#map').on('click', 'button', function () {
        // e.preventDefault(e);
        console.log(mapApp.destAddress);
        mapApp.test = $('.address').text();
        console.log('test', mapApp.test);
        // this hangs the code so bad!!!!!!!!!!!!!!!!!!!
        // for (i = 0; i = mapApp.destAddress.length; i++) {
        //     if (mapApp.destAddress[i] === $('.address').text()) {
        //         mapApp.destination = mapApp.destAddress[i];
        //         break
        //     }
        //     break
        // }
        console.log(mapApp.origin, mapApp.destination);
        $.ajax({
            url: mapApp.directionUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                // calling the data parameters in the order that
                // is on the website
                key: mapApp.apiKey,
                from: mapApp.origin,
                to: mapApp.test,
                units: 'k',
                routeType: 'pedestrian',

            }
        }).then(function (directionData) {
            console.log(directionData);
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