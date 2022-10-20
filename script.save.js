// Create request url for openweathermap.org
var APIkey = "923d9e379d8c5e5c3deb64d1aca43984";
APIkey = "38a07275b84946c812dcb08c2e4bd539";
APIkey = "54b8a6bb85940adfee9d84b904f8081d";
var map;


// Define function to load historical data
function loadHistory() {
    // Get the data from the server
    $("#history").empty();

    var history = JSON.parse(localStorage.getItem("history")) || [];

    for (var i = 0; i < history.length; i++) {

        $("#history").append(
            $("<button>")
                .addClass("btn btn-secondary btn-block")
                .text(history[i])
                .on("click", function () {
                    requestCity($(this).text());
                })
        );
    }
}
// Add event listener for city search
function addButtonListener() {
    $("#city-search").on("click", function (event) {
        event.preventDefault();
        var cityState = $("#city-input").val();
        var city = cityState.split(",")[0];
        $("#city-input").val("");
        requestCity(city);
    });

    $("#clear-history").on("click", function () {
        localStorage.clear();
        loadHistory();
    });
}
function requestCity(city) {
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonObject) {

            // Check if city not found
            if (jsonObject.cod == "404") {
                alert("City not found");
                return;
            }

            setToday(city, jsonObject);
            console.log(jsonObject);
            var lat = jsonObject.coord.lat;
            var lon = jsonObject.coord.lon;
            var elv = jsonObject.coord.elevation;
            var forecastURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${APIkey}&units=imperial`;
            requestForecast(city, forecastURL);


z =10;
            

//             <div id="openweathermap-widget-15"></div>
// <script>window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  window.myWidgetParam.push({id: 15,cityid: '5318313',appid: '54b8a6bb85940adfee9d84b904f8081d',units: 'imperial',containerid: 'openweathermap-widget-15',  });  (function() {var script = document.createElement('script');script.async = true;script.charset = "utf-8";script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";var s = document.getElementsByTagName('script')[0];s.parentNode.insertBefore(script, s);  })();</script>

            //  var radarURL = `http://maps.openweathermap.org/maps/2.0/weather/TA2/5/30/20?fill_bound=true&appid=${APIkey}`
            var radarURL = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=44.34&lon=10.99&appid=${APIkey}`;

            console.log(radarURL);
            // Embed openweathermap.org map
            var mapURL = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=${z}`;
            console.log(mapURL);
            $("#mapI").attr("src", mapURL);

        //     // Query map for city
        //     var geocoder = new google.maps.Geocoder();
        //     geocoder.geocode({ "address": city }, function (results, status) {
        //         console.log(results);
        //         console.log(status);
        //         if (status == google.maps.GeocoderStatus.OK) {
        //             var glat = results[0].geometry.location.lat();
        //             var glon = results[0].geometry.location.lng();
        //             var gelv = results[0].elevation;
        //             z = 8;


        //             var tile = latLonToTile(glat, glon, z);
        //             var latlon = tileToLatLon(tile[0], tile[1], z);


        //             var mapURL = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon[0]},${latlon[1]}&zoom=${z}&size=256x256&key=AIzaSyAJI1p10TuzIala94nhFWdfAZerjAW_Rwo`;
        //             console.log(mapURL);
        //             // $("#map").attr("src", mapURL);
        //             var tile = latLonToTile(glat, glon, z);

        //             // Get opemweathermap.org radar image
        //             var radarURL = `https://tile.openweathermap.org/map/temp_new/${z}/${tile[0]}/${tile[1]}.png?appid=${APIkey}`;
        //             //radarURL = `http://maps.openweathermap.org/maps/2.0/weather/TA2/5/30/20?fill_bound=true&appid=${APIkey}`
        //             // radarURL = `http://maps.openweathermap.org/maps/2.0/weather/TA2/${z}/${tile[0]}/${tile[1]}?appid=${APIkey}&fill_bound=true&opacity=0.6&palette=-65:821692;-55:821692;-45:821692;-40:821692;-30:8257db;-20:208cec;-10:20c4e8;0:23dddd;10:c2ff28;20:fff028;25:ffc228;30:fc8014`
        //             console.log("----- radar url ----- -")
        //             console.log(radarURL);
        //             // $("#mapW").attr("src", radarURL);

        //             // Select the element with id="map".
        //             // var layerID = 'my-custom-layer';
        //             // mapEl = document.querySelector('#map');

        //             // Create a new map.
        //             // map = new google.maps.Map(mapEl, {
        //             //     center: new google.maps.LatLng(glat, glon),
        //             //     maptype: google.maps.MapTypeId.HYBRID,
        //             //     zoom: z
        //             // });
        //             // var TILE_URL = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
        //             var TILE_URL = `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${APIkey}`;
        //             // TILE_URL = `http://maps.openweathermap.org/maps/2.0/weather/TA2/{z}/{x}/{y}?appid=${APIkey}&fill_bound=true&opacity=0.6&palette=-65:821692;-55:821692;-45:821692;-40:821692;-30:8257db;-20:208cec;-10:20c4e8;0:23dddd;10:c2ff28;20:fff028;25:ffc228;30:fc8014`;
        //             //TILE_URL = 
        //             // Create a tile layer, configured to fetch tiles from TILE_URL.
        //             // layer = new google.maps.ImageMapType({
        //             //     name: layerID,
        //             //     getTileUrl: function (coord, zoom) {
        //             //         console.log(coord);
        //             //         var url = TILE_URL
        //             //             .replace('{x}', coord.x)
        //             //             .replace('{y}', coord.y)
        //             //             .replace('{z}', zoom);
        //             //         console.log(url);
        //             //         return url;
        //             //     },
        //             //     isPng: true,
        //             //     tileSize: new google.maps.Size(256, 256),
        //             //     minZoom: 1,
        //             //     maxZoom: 20,
        //             //     opacity: 0.60
        //             // });

        //             // // Apply the new tile layer to the map.
        //             // map.mapTypes.set(layerID, layer);
        //             // // Add listener to submit button
        //             // $("#submit").click(function () {
        //             //     map.setMapTypeId(layerID);
        //             // });



        //         }
        //     })

        });

}

// Convert tile coordinates to latitude and longitude
function tileToLatLon(xtile, ytile, zoom) {
    var n = Math.pow(2, zoom);
    var lon_deg = xtile / n * 360.0 - 180.0;
    var lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * ytile / n)));
    var lat_deg = lat_rad * (180.0 / Math.PI);
    return [lat_deg, lon_deg];
}

// Convert latitude and longitude to tile coordinates
function latLonToTile(lat, lon, zoom) {
    var n = Math.pow(2, zoom);
    var xtile = Math.floor((lon + 180) / 360 * n);
    var ytile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
    return [xtile, ytile];
}

// Save city to local storage
function setCity(city) {
    var history = JSON.parse(localStorage.getItem("history"));
    if (history == null) {
        history = [];
    }

    if (history.indexOf(city) == -1) {

        history.push(city);
        localStorage.setItem("history", JSON.stringify(history));
    }
    loadHistory();

}

function setToday(city, day) {

    console.log(day);
    $("#forecast").empty();
    $("#table-header").empty();
    $("#city-name").text(city);
    // Set today's date
    $("#date").text("(" + moment().format("MM/DD/YYYY") + ")");
    // Set today's icon
    $("#icon").attr("src", `https://openweathermap.org/img/w/${day.weather[0].icon}.png`);
    // Set today's description
    // $("#description").text(day.weather[0].description);
    // Set today's temperature
    $("#temp").text("Temp: " + day.main.temp + " °F");
    // Set today's humidity
    $("#humidity").text("Humidity: " + day.main.humidity + " %");
    // Set today's wind speed
    $("#wind-speed").text("Wind: " + day.wind.speed + " mph");
    // Set today's UV index
    // $("#uv-index").text("UV: " + day.main.uvi + " %");
}

function createForecastCards(forecast) {
    // Iterate through the list of forecast days
    // Get daily forecast from day 1 to day 5
    $("#forecast-card").empty();
    var daily = forecast.daily.slice(1, 6);
    for (var i = 0; i < daily.length; i++) {

        var wday = moment.unix(daily[i].dt).format("dddd");
        var date = moment.unix(daily[i].dt).format("MM/DD/YYYY");
        var icon = "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png";
        var temp = daily[i].temp.day + " °F";
        var wind = daily[i].wind_speed + " MPH";
        var humidity = daily[i].humidity + " %";

        var grid = $("<div>").addClass("col-lg-2 col-sm-12");
        var card = $("<div>").addClass("card bg-primary text-white");
        var cardBody = $("<div>").addClass("card-body card-body-custom");
        var cardTitle = $("<h5>").addClass("card-title").text(wday);
        var cardDate = $("<h6>").addClass("date").text(date);
        var cardIcon = $("<img>").attr("src", icon);
        var cardTemp = $("<p>").addClass("card-text").text("Temp: " + temp);
        var cardWind = $("<p>").addClass("card-text").text("Wind: " + wind);
        var cardHumidity = $("<p>").addClass("card-text").text("Humidity: " + humidity);
        cardBody.append(cardTitle, cardDate, cardIcon, cardTemp, cardWind, cardHumidity);
        card.append(cardBody);
        grid.append(card);
        $("#forecast-card").append(grid);

    }

}


function requestForecast(city, forecastURL) {
    fetch(forecastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonObject) {
            setCity(city);
            // createForecastTable(jsonObject);
            createHourlyTable(jsonObject);
            createForecastCards(jsonObject);
        }
        );
}

function createHourlyTable(forecast) {
    // Iterate through the list of forecast days
    // Get daily forecast from day 1 to day 5
    $("#table-header").empty();
    $("#forecast").empty();
    var hourly = forecast.hourly.slice(0, 24);
    for (var i = 0; i < hourly.length; i++) {
        




function initDashboard() {

    // Set today's date
    $("#date").text("(" + moment().format("MM/DD/YYYY") + ")");
    // Set today's icon
    //$("#icon").attr("src", `https://openweathermap.org/img/w/${day.weather[0].icon}.png`);
    // Set today's description
    // $("#description").text(day.weather[0].description);
    // Set today's temperature
    $("#temp").text("Temp: °F");
    // Set today's humidity
    $("#humidity").text("Humidity: %");
    // Set today's wind speed
    $("#wind-speed").text("Wind: MPH");
    // Set today's UV index
    // $("#uv-index").text("UV: %");

    for (var i = 0; i < 5; i++) {

        var day = moment().add(i + 1, 'days');

        var wday = day.format("dddd");
        var date = day.format("MM/DD/YYYY");
        // var icon = "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png";
        var temp = " °F";
        var wind = " MPH";
        var humidity = " %";

        var grid = $("<div>").addClass("col-lg-2 col-sm-12");
        var card = $("<div>").addClass("card bg-primary text-white");
        var cardBody = $("<div>").addClass("card-body card-body-custom");
        var cardTitle = $("<h5>").addClass("card-title").text(wday);
        var cardDate = $("<h6>").addClass("date").text(date);
        var cardIcon = $("<img>"); //.attr("src", icon);
        var cardTemp = $("<p>").addClass("card-text").text("Temp: " + temp);
        var cardWind = $("<p>").addClass("card-text").text("Wind: " + wind);
        var cardHumidity = $("<p>").addClass("card-text").text("Humidity: " + humidity);
        cardBody.append(cardTitle, cardDate, cardIcon, cardTemp, cardWind, cardHumidity);
        card.append(cardBody);
        grid.append(card);
        $("#forecast-card").append(grid);

    }
}


$(document).ready(function () {
    initialize();
    initDashboard();
    loadHistory();
    // Add click event listener to clear history button
    addButtonListener();
    // requestCity("Tucson");
});


function initialize() {
    var input = document.getElementById('city-input');
    var options = {
        types: ['(cities)'],
        componentRestrictions: { country: "us" }
    };
    new google.maps.places.Autocomplete(input, options);
}