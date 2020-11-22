// Project 4 @ Juno College
// Find a restaurant near you!
// Creators: Christine Shiels & Ben Sarjeant
// Note to readers: mapquests results can be incredibly inaccurate, we wanted to use google maps api but a lot of the features were paywalled

// declaring namespace
const mapApp = {};

// start of global variables
mapApp.apiKey ='Tfj4LjgSABueLr8yE5j99mdAMj3Fgspu';
// MapQuest Search API Url
mapApp.searchUrl='http://www.mapquestapi.com/search/v2/radius';
// MapQuest Directions API Url
mapApp.directionUrl= 'http://open.mapquestapi.com/directions/v2/optimizedroute';
// global variables used throughout ajax requests
mapApp.units = '';
mapApp.radius = '';
mapApp.origin = '';
mapApp.originCity = '';
mapApp.completeOriginCity = '';
mapApp.ambiguities = '';
// global variables for markers which will be displayed on map
mapApp.marker = '';
mapApp.markerArray = [];
// location for center point of the landing map page
mapApp.lat = '59.566601';   
mapApp.long = '-98.6166';
// global variables for get directions request
mapApp.destAddress = '';
mapApp.destCity = '';
mapApp.destCompleteAddress = '';
mapApp.directionsText = [];
mapApp.directionsDistance = [];
// end of global variables


// start of map initializing function required to use built in methods & to display map on page
mapApp.mapInit = () => {

    L.mapquest.key = mapApp.apiKey;

    // this chunk of code is what actually displays the map on the page
    // 'map' refers to the <div> element with the ID map
    const map = new L.mapquest.map('map', {
        center: [mapApp.lat, mapApp.long],
        layers: L.mapquest.tileLayer('map'),
        zoom: 4
    });

    // getinfo() is an ajax request - needs to be called within mapInit() function in order to use the ajax returns in combination with mapquest/leaflet methods
    mapApp.getInfo();

    // function to pan to users inputted location based off of ajax request
    // function sets a zoom for the map, moves location of map to the long and lat and sizes the map to view all available restaurants
    mapApp.panToUser = (lat, lng) => {
        map.setZoom(14);
        map.panTo([lat, lng]);
        let markerGroup = new L.featureGroup(mapApp.markerArray);
        map.fitBounds(markerGroup.getBounds());
    }

    // function to dynamically add markers on map based off of ajax request
    mapApp.addMarkers = function(lat, long, name, address, city, phone)  {
        mapApp.marker = new L.marker([lat, long]);
        mapApp.markerArray.push(L.marker([lat, long]));
        map.addLayer(mapApp.marker);
        // dynamically add information to marker when clicked based off of ajax
        mapApp.marker.bindPopup(`
            <h4 class="name">${name}</h4>
            <h5 class="address">${address}</h5>
            <h5 class="city">${city}</h5>
            <h6>${phone}</h6>
            <button class="directionButton">Get Directions</button>
        `);
    }

    // getDirections() is also another ajax request from an additional API
    mapApp.getDirections();


    // function to clear all previous markers on submit
    // visually removes markers from map and resets array containing all markers
    mapApp.clearMarkers = function() {
        $(".leaflet-marker-icon").remove();
        $(".leaflet-pane.leaflet-shadow-pane").css('display', 'none');
        mapApp.markerArray = [];
    }
}
// end of map initalize function


// start of function to fire once user submits form
mapApp.getInfo = (function () {
    
    // utilizing the MapQuest Search API to fire an ajax query on a form submit
    $('.form').on('submit', function (e) {
        e.preventDefault(e);

        // storing form submissions in global variables to be used in ajax call
        mapApp.origin = $('#origin').val();
        mapApp.originCity = $('#city').val();
        mapApp.radius = $('#radius').val();
        mapApp.units = $('input[name="units"]:checked').val();

        // creation of variable to store complete addresses
        mapApp.completeOriginCity = String(mapApp.origin + ', ' + mapApp.originCity);
        
        // start of search ajax call
        $.ajax({
            url: mapApp.searchUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                key: mapApp.apiKey,
                origin: mapApp.completeOriginCity,
                radius: mapApp.radius,
                units: mapApp.units,
                ambiguities: mapApp.ambiguities,
                // SQL query to get all data with the (all) restaurant SIC code
                hostedData: 'mqap.ntpois|group_sic_code_ext LIKE?|581208'
            }
        }).then(function (searchData) {
            // some basic error handling to make sure the user types in a correct address
            if (searchData.origin === undefined ) {
                alert("This address does not exist in MapQuest, please try again.");
                return;
            } else if (searchData.searchResults === undefined) {
                alert("No results within your search area, please increase distance or find new location.")
                return;
            }

            // clearing any markers from previous result
            mapApp.clearMarkers();
        
            // iterating through each poi
            searchData.searchResults.forEach(poi => {

                // calling marker func that is declared in mapinit to dynamically add markers to map and passing it all the relevant data
                mapApp.addMarkers(poi.fields.lat, poi.fields.lng, poi.fields.name, poi.fields.address, poi.fields.city, poi.fields.phone)
            });

            // calling func to move center point of map based off created variables above
            mapApp.panToUser(searchData.origin.latLng.lat, searchData.origin.latLng.lng);
        })
        // end of search ajax call
    })
    // end of jQuery on form submit statement
})
// end of getInfo() function


// start of function to fire once user clicks on "Get Directions" button on marker popup
mapApp.getDirections = (function () {

    // utilizing the MapQuest Directions API to fire an ajax query on a button click
    $('#map').on('click', '.directionButton', function () {

        // firing the show directions function to hide the user form and display div holding list of directions, function found near bottom
        mapApp.showDirections();
    
        // empty arrays to store list of directions and associated distance & clearing of div containing said directions
        mapApp.directionsText = [];
        mapApp.directionsDistance = [];
        $('.directionsList').html('');

        // storing the selected markers address and city to be used later
        mapApp.destAddress = $('.address').text();
        mapApp.destCity = $('.city').text();
        mapApp.destName = $('.name').text();
        console.log(mapApp.destName)
        
        // switch statement to give varying directions if user is walking or driving
        switch (mapApp.units) {
            // if walking (wmin = walking minutes)
            case "wmin":
                mapApp.units = 'pedestrian';
                break;
            // if driving (dmin = walking minutes)
            case "dmin":
                mapApp.units = 'fastest';
                break;
        }

        // creation of variable to store complete destination addresses
        mapApp.destCompleteAddress = String(mapApp.destAddress + ', ' + mapApp.destCity);

        // function to hide direction div
        mapApp.hideDirections();

        // start of direction ajax call
        $.ajax({
            url: mapApp.directionUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                key: mapApp.apiKey,
                from: mapApp.completeOriginCity,
                to: mapApp.destCompleteAddress,
                units: 'k',
                routeType: mapApp.units,
            }
        }).then(function (directionData) {
            // conditional to make sure marker user clicks on has accurate data (mapquests data sucks sometimes)
            if (directionData.route.legs === undefined) {
                alert("Sorry, MapQuests data for this location is inaccurate, please select another location.")
                return;
            } else {
                // forEach loop to loop through each 'maneuver'/direction and push application information to array (narrative of direction & distance of direction)
                directionData.route.legs[0].maneuvers.forEach(direction => {

                    // pushing the textual direction to an array which will be used to display on page
                    mapApp.directionsText.push(direction.narrative);

                    // conditional to check distance of each direction, for visability purposes we are coverting km to m if the distance is less than 1 km
                    if (direction.distance < 1) {

                        // conversion to meters
                        direction.distance = direction.distance * 1000;
            
                        // pushing the numerical distance of direction to an array to display on page (for meters)
                        mapApp.directionsDistance.push(direction.distance + ' m');

                    } else {
                        // pushing the numerical distance of direction to an array to display on page (for kilometers)
                        mapApp.directionsDistance.push(direction.distance + ' km');
                    }
                    // end of conversion conditional 
                })
                // end forEach statement iterating over each literal direction
            }
            // end of conditional checking data integrity 


            // setting the title of the direction section to explicity say the restaurants name
            $('.directions h3').text(` Directions to ${mapApp.destName}`);


            // for loop to loop through each directions and append information gathered from ajax request into directionsList div, if it is the last direction given append slightly different html
            for (let i = 0; i < mapApp.directionsDistance.length; i++) {
                if (i === (mapApp.directionsDistance.length - 1)) {
                    $('.directionsList').append(`<li>You've arrived at ${mapApp.directionsText[i]} </li>`);
                } else {
                    $('.directionsList').append(`<li>${mapApp.directionsText[i]} for ${mapApp.directionsDistance[i]} </li>`);
                }
            }
            // end of for loop to append directions
        })
        // end of direction ajax call

        // jquery to hide the 'get directions' button after click on the map pane
        $('.directionButton').addClass('invisible');
    })
    // end of jQuery on button click statement
})
// end of getDirections() function


// function to display directions and hide form input
mapApp.showDirections = function () {
    $('.form').addClass('submitted');
    $('input').addClass('invisible');
    $('label').addClass('invisible');
    $('.formTitle').html('<button class="backButton" type="button">Back to Form</button>');
    $('.directions').removeClass('invisible');
}

// function to hide directions and show form input
mapApp.hideDirections = function() {
    $('.backButton').on('click', function() {
        $('.form').removeClass('submitted');
        $('input').removeClass('invisible');
        $('label').removeClass('invisible');
        $('.formTitle').html('<h3 class="formTitle">How are you getting there?</h3>');
        $('.directions').addClass('invisible');
    })
}

// initialization function to call map initalize function
mapApp.init = () => {
    mapApp.mapInit();
}

// function to ensure document is ready
$(function() {
    mapApp.init();
})