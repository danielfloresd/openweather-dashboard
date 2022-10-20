// Create request url for openweathermap.org
var APIkey = "923d9e379d8c5e5c3deb64d1aca43984";
APIkey = "38a07275b84946c812dcb08c2e4bd539";



// Define function to load historical data
function loadHistory() {
    // Get the data from the server
    // Create history list
    var historyList = $("#history");
    historyList.empty();

    var history = JSON.parse(localStorage.getItem("history")) || [];

    for (var i = 0; i < history.length; i++) {
        var city = history[i];
        var li = $("<button>");
        li.addClass("btn btn-secondary btn-block");
        li.attr("href", "#").text(city);
        // Add click event listener to the list item
        li.on("click", function () {
            var city = $(this).text();
            requestCity(city);
        });
        historyList.append(li);
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
            var lat = jsonObject.coord.lat;
            var lon = jsonObject.coord.lon;
            var forecastURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${APIkey}&units=imperial`;
            requestForecast(city, forecastURL);
            var z=10;
            var mapURL = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=${z}`;
            console.log(mapURL);
            $("#mapI").attr("src", mapURL);

        });

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
    
    $("#forecast").empty();
    $("#table-header").empty();
    $("#city-name").text(city);
    $("#city-name").text(city);
    // Set today's date
    $("#date").text("(" + moment().format("MM/DD/YYYY") + ")");
    // Set today's icon
    $("#icon").attr("src", `https://openweathermap.org/img/w/${day.weather[0].icon}.png`);
    // Set today's description
    // $("#description").text(day.weather[0].description);
    // Set today's temperature
    $("#temp").text("Temp: " + Math.round(day.main.temp) + " °F");
    // Set today's humidity
    $("#humidity").text("Humidity: " + day.main.humidity + " %");
    // Set today's wind speed
    $("#wind-speed").text("Wind: " + Math.round(day.wind.speed) + " mph");
    // Set today's UV index
    // $("#uv-index").text("UV: " + day.uvi + " %");
}

function createForecastTable(forecast) {
    // Iterate through the list of forecast days
    // Get daily forecast from day 1 to day 5

    var daily = forecast.daily.slice(1, 6);

    // Create table header
    $("#table-header").append($("<th>"));

    for (var i = 0; i < daily.length; i++) {
        var day = moment.unix(daily[i].dt).format("dddd");
        $("#table-header")
            .append($("<th>")
                .text(day));
    }

    // Map daily to a new array of objects that only contain the date and the icon code
    var dailyForecast = daily.map(function (day) {
        return {
            // weekday: moment.unix(day.dt).format("dddd"),
            date: moment.unix(day.dt).format("MM/DD/YYYY"),
            icon: $("<img>").attr("src", "https://openweathermap.org/img/w/" + day.weather[0].icon + ".png"),
            temp: day.temp.day + " °F",
            wind: Math.round(day.wind_speed) + " mph",
            humidity: day.humidity + " %"
        };
    });


    var rowObject = {
        // weekday: "",
        date: "Date",
        icon: "Weather",
        temp: "Temp",
        wind: "Wind",
        humidity: "Humidity"
    }

    // Add the row object to the beginning of the array
    dailyForecast.unshift(rowObject);

    tForecast = transpose(dailyForecast);

    // Iterate through the list of forecast days
    for (var i = 0; i < tForecast.length; i++) {
        // Create table row using jQuery
        var tr = $("<tr>");

        for (var j = 0; j < tForecast[i].length; j++) {
            var td = $("<td>");
            td.append(tForecast[i][j]);
            tr.append(td);
        }
        $("#forecast").append(tr);
    }
}

function createHourlyForecastTable(forecast) {
    console.log(forecast);
    // Iterate through the list of forecast days
    // Get daily forecast from day 1 to day 5

    // var daily = forecast.daily.slice(1, 6);
    // Get hourly forecast for today
    var hourly = forecast.hourly.slice(1, 6);

    // Create table header
    // $("#table-header").append($("<th>"));

    for (var i = 0; i < hourly.length; i++) {
        console.log("hourly", hourly[i]);
        var hour = moment.unix(hourly[i].dt).format("h A");
        $("#table-header")
            .append($("<th>")
                .text(hour));
    }

    // Map daily to a new array of objects that only contain the date and the icon code
    var hourlyForecast = hourly.map(function (hour) {
        return {
            // weekday: moment.unix(day.dt).format("dddd"),
            // hour: moment.unix(hour.dt).format("MM/DD/YYYY"),
            temp: Math.round(hour.temp) + " °F",
            icon: $("<img>").attr("src", "https://openweathermap.org/img/w/" + hour.weather[0].icon + ".png"),
            // temp: Math.round(hour.temp) + " °F",
            // wind: hour.wind_speed + " mph",
            // humidity: hour.humidity + " %"
        };
    });


    var rowObject = {
        // weekday: "",
        // hour: "Hour",
        // icon: "",
        temp: "",
        icon: ""
        // wind: "Wind",
        // humidity: "Humidity"
    }

    // // Add the row object to the beginning of the array
    // hourlyForecast.unshift(rowObject);

    tForecast = transpose(hourlyForecast);

    // Iterate through the list of forecast days
    for (var i = 0; i < tForecast.length; i++) {
        // Create table row using jQuery
        var tr = $("<tr>");

        for (var j = 0; j < tForecast[i].length; j++) {
            var td = $("<td>");
            td.append(tForecast[i][j]);
            tr.append(td);
        }
        $("#forecast").append(tr);
    }
}

function createForecastCards(forecast) {
    // Iterate through the list of forecast days
    // Get daily forecast from day 1 to day 5
    $("#forecast-card").empty();
    var daily = forecast.daily.slice(1, 6);
    for(var i = 0; i < daily.length; i++) {

        var time = moment.unix(daily[i].dt).format("dddd");
        var icon = "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png";
        var temp = Math.round(daily[i].temp.day) + " °F";
        var wind = Math.round(daily[i].wind_speed) + " mph";
        var humidity = daily[i].humidity + " %";

        var grid = $("<div>").addClass("col-lg-2 col-sm-12 m-1");
        var card = $("<div>").addClass("card text-white");
        var cardBody = $("<div>").addClass("card-body bg-primary row");
        // var cardTitleDiv = $("<div>").addClass("row col-6");
        var cardTitleDiv = $("<ul>").addClass("list-group list-unstyled col-6 col-lg-12");
        var cardTitle = $("<li>").append($("<h5>").addClass("card-title").text(time));

        cardTitleDiv.append(cardTitle);
        
        var cardList = $("<ul>").addClass("list-group list-unstyled");
        var cardIcon = $("<li>").append($("<img>").attr("src", icon));
        var cardTemp = $("<li>").addClass("card-text").text("Temp: " + temp);
        var cardWind = $("<li>").addClass("card-text").text("Wind: " + wind);
        var cardHumidity = $("<li>").addClass("card-text").text("Humidity: " + humidity);
        
        cardTitleDiv.append(cardIcon);
        cardList.append(cardTemp, cardWind, cardHumidity);
        cardBody.append(cardTitleDiv, cardList);
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
            createHourlyForecastTable(jsonObject);
            createForecastCards(jsonObject);
        }
        );
}
// Transpose Array of Objects
// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    })
};


$(document).ready(function () {
    initialize();
    loadHistory();
    initDashboard();
    // Add click event listener to clear history button
    addButtonListener();
});



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

function initialize() {
    var input = document.getElementById('city-input');
    var options = {
        types: ['(cities)'],
        componentRestrictions: { country: "us" }
    };
    new google.maps.places.Autocomplete(input, options);
}