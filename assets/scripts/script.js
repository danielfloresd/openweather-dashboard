// Create request url for openweathermap.org
var APIkey = "38a07275b84946c812dcb08c2e4bd539";
var units = "imperial";
var currentCity = "Tucson";
var mapURL = "https://openweathermap.org/wathermap";

// Transpose Array of Objects
function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    })
};

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

function requestCity(city) {
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=${units}`;

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
            var forecastURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${APIkey}&units=${units}`;
            requestForecast(city, forecastURL);
            var z = 10;
            mapURL = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=${z}`;

        });

}


// Save city to local storage
function storeCity(city) {
    var history = JSON.parse(localStorage.getItem("history"));
    if (!history)
        history = [];

    // If city not already in history add it
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
    // Set today's date
    $("#date").text("(" + moment().format("MM/DD/YYYY") + ")");
    // Set today's icon
    $("#icon").attr("src", `https://openweathermap.org/img/w/${day.weather[0].icon}.png`)
        .attr("alt", day.weather[0].description);
    // Set today's temperature
    var unit = units == "metric" ? "C" : "F";
    $("#temp").text("Temp: " + Math.round(day.main.temp) + " ??" + unit);
    // Set today's humidity
    $("#humidity").text("Humidity: " + day.main.humidity + " %");
    // Set today's wind speed
    $("#wind-speed").text("Wind: " + Math.round(day.wind.speed) + " mph");
}

function createHourlyForecastTable(forecast) {

    // Get daily forecast from day 1 to day 5
    var hourly = forecast.hourly.slice(1, 6);
    // Create table header
    for (var i = 0; i < hourly.length; i++) {
        var hour = moment.unix(hourly[i].dt).format("h A");
        $("#table-header")
            .append($("<th>")
                .text(hour));
    }

    // Map daily to a new array of objects that only contain the date and the icon code
    var hourlyForecast = hourly.map(function (hour) {
        return {
            temp: Math.round(hour.temp) + " ??" + (units == "metric" ? "C" : "F"),
            icon: $("<img>").attr("src", "https://openweathermap.org/img/w/" + hour.weather[0].icon + ".png")
                .attr("alt", hour.weather[0].description),
        };
    });

    var tForecast = transpose(hourlyForecast);

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

function createHourlyForecastCards(forecast) {
    $("#hourly-cards").empty();
    // Get daily forecast from day 1 to day 5
    var hourly = forecast.hourly.slice(1, 6);
    // Create table header
    // Create card

    for (var i = 0; i < hourly.length; i++) {
        var hour = moment.unix(hourly[i].dt).format("h A");
        // Create card title
        var card = $("<div>")
            .addClass("card");
        var cardTitle = $("<div>")
            .addClass("card-title ")
            .text(hour);
        card.append(cardTitle);

        // Create card body
        var cardBody = $("<div>")
            .addClass("card-body");
        // Add text to card body
        cardBody.append($("<p>")
            .text(Math.round(hourly[i].temp) + " ??" + (units == "metric" ? "C" : "F")));
        // Add weather icon to card body
        cardBody.append($("<img>")
            .attr("src", "https://openweathermap.org/img/w/" + hourly[i].weather[0].icon + ".png")
            .attr("alt", i + ": " + hourly[i].weather[0].description));


        card.append(cardBody);

        // Add card to card deck
        console.log("appeding card");
        console.log(card);
        $("#hourly-cards").append(card);

    }
}

function createForecastCards(forecast) {
    // Iterate through the list of forecast days
    // Get daily forecast from day 1 to day 5
    $("#forecast-card").empty();
    var daily = forecast.daily.slice(1, 6);
    for (var i = 0; i < daily.length; i++) {

        // Get weather information for the day
        var time = moment.unix(daily[i].dt).format("dddd");
        var date = moment.unix(daily[i].dt).format("MM/DD/YYYY");
        var icon = "https://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png";
        var unit = units == "metric" ? "C" : "F";
        var temp = Math.round(daily[i].temp.day) + " ??" + unit;
        var wind = Math.round(daily[i].wind_speed) + " mph";
        var humidity = daily[i].humidity + " %";

        // Create card element using jQuery
        var grid = $("<div>")
            .addClass("card card-body-custom");
        var card = $("<div>")
            .addClass("text-white");
        var cardBody = $("<div>")
            .addClass("card-body row");
        var cardTitleDiv = $("<ul>")
            .addClass("list-group list-unstyled col-6 col-lg-12");
        var cardTitle = $("<li>")
            .append($("<h3>")
                .addClass("card-title font-weight-bold")
                .text(time));
        var cardSubTitle = $("<li>")
            .append($("<p>"))
            .text(date);

        cardTitleDiv.append(cardTitle, cardSubTitle);

        var cardList = $("<ul>")
            .addClass("list-group list-unstyled");
        var cardIcon = $("<li>").append($("<img>").attr("src", icon)
            .attr("alt", daily[i].weather[0].description));
        var cardTemp = $("<li>")
            .addClass("card-text")
            .text("Temp: " + temp);
        var cardWind = $("<li>")
            .addClass("card-text")
            .text("Wind: " + wind);
        var cardHumidity = $("<li>")
            .addClass("card-text")
            .text("Humidity: " + humidity);
        // Appending card elements to cardList, Body and grid
        cardTitleDiv.append(cardIcon);
        cardList.append(cardTemp, cardWind, cardHumidity);
        cardBody.append(cardTitleDiv, cardList);
        card.append(cardBody);
        grid.append(card);
        // Adding the card to the forecast-card div
        $("#forecast-card").append(grid);

    }

}

function requestForecast(city, forecastURL) {
    fetch(forecastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonObject) {
            storeCity(city);
            createHourlyForecastTable(jsonObject);
            // createHourlyForecastCards(jsonObject);
            createForecastCards(jsonObject);
        }
        );
}

// Add event listener for city search
function addButtonListener() {
    $("#city-search").on("click", function (event) {
        event.preventDefault();
        var cityState = $("#city-input").val();
        currentCity = cityState.split(",")[0];
        $("#city-input").val("");
        requestCity(currentCity);
    });

    // Add keyboard enter event listener on city input
    $("#city-input").on("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#city-search").click();
        }
    });

    $("#clear-history").on("click", function () {
        localStorage.clear();
        loadHistory();
    });

    // Add event listener for celcius button
    $("#celcius").on("click", function () {
        units = "metric";
        requestCity(currentCity);
    });

    // Add event listener for farenheit button
    $("#farenheit").on("click", function () {
        units = "imperial";
        requestCity(currentCity);
    });

    $("#openweathermap").on("click", function () {
        console.log("map url:" + mapURL);
        window.open(mapURL);
    });

}

function initDashboard() {

    // Set today's date
    $("#date").text("(" + moment().format("MM/DD/YYYY") + ")");
    // Set today's temperature
    $("#temp").text("Temp: ??F");
    // Set today's humidity
    $("#humidity").text("Humidity: %");
    // Set today's wind speed
    $("#wind-speed").text("Wind: MPH");

    for (var i = 0; i < 5; i++) {
        var day = moment().add(i + 1, 'days');

        var wday = day.format("dddd");
        var date = day.format("MM/DD/YYYY");
        var temp = " ??F";
        var wind = " MPH";
        var humidity = " %";

        var grid = $("<div>")
            .addClass("card card-body-custom");
        var card = $("<div>")
            .addClass("card-title text-white");
        var cardBody = $("<div>")
            .addClass("card-body row");
        var cardTitleDiv = $("<ul>")
            .addClass("list-group list-unstyled col-6 col-lg-12");
        var cardTitle = $("<li>")
            .append($("<h3>")
                .addClass("card-title font-weight-bold")
                .text(wday));
        var cardSubTitle = $("<li>")
            .append($("<p>")
                .text(date));

        cardTitleDiv.append(cardTitle, cardSubTitle);

        var cardList = $("<ul>")
            .addClass("list-group list-unstyled");
        var cardTemp = $("<li>")
            .addClass("card-text")
            .text("Temp: " + temp);
        var cardWind = $("<li>")
            .addClass("card-text")
            .text("Wind: " + wind);
        var cardHumidity = $("<li>")
            .addClass("card-text")
            .text("Humidity: " + humidity);

        cardList.append(cardTemp, cardWind, cardHumidity);
        cardBody.append(cardTitleDiv, cardList);
        card.append(cardBody);
        grid.append(card);
        $("#forecast-card").append(grid);

    }
}

$(document).ready(function () {
    loadHistory();
    initDashboard();
    // Add click event listener to clear history button
    addButtonListener();
});
