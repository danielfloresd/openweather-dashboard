// Create request url for openweathermap.org
var APIkey = "923d9e379d8c5e5c3deb64d1aca43984";
APIkey = "38a07275b84946c812dcb08c2e4bd539";
var cityname = "Tucson";
var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`
// https://api.openweathermap.org/data/3.0/onecall?lat=32.2217&lon=-110.9265&exclude=current,minutely,hourly,alerts&appid=38a07275b84946c812dcb08c2e4bd539&units=metric
// fetch request
fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonObject) {
        console.log(jsonObject);
    });

var forcastURL = "https://api.openweathermap.org/data/3.0/onecall?lat=32.2217&lon=-110.9265&exclude=current,minutely,hourly,alerts&appid=38a07275b84946c812dcb08c2e4bd539&units=metric"
// fetch request
// fetch(forcastURL)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (jsonObject) {
//         console.log(jsonObject);
//     });

//     var forcastURL = "https://api.openweathermap.org/data/3.0/onecall?q=Tucson&exclude=current,minutely,hourly,alerts&appid=38a07275b84946c812dcb08c2e4bd539&units=metric"
//     fetch(forcastURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (jsonObject) {
//             console.log(jsonObject);
//         });

//         forcastURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=Tucson&units=imperial&cnt=5&appid=746a6e0471547b3aa9ba1351082eb0a3"

// Function to create image element from url using jQuery
function createImageElement(url) {
    var img = $("<img>");
    img.attr("src", url);
    return img;
}



fetch(forcastURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonObject) {

        console.log(jsonObject);
        var city = "Tucson";
        // Add city to history list
        var history = JSON.parse(localStorage.getItem("history")) || [];
        if (history.indexOf(city) === -1) {
            history.push(city);
            localStorage.setItem("history", JSON.stringify(history));
        }

        // Create history list
        var historyList = $("#history");
        historyList.empty();
        for (var i = 0; i < history.length; i++) {
            var city = history[i];
            var li = ($("<button>").attr("href", "#").text(city));
            historyList.append(li);
        }

        // Get today forecast
        var day = jsonObject.daily[0];
        // Set city name
        $("#city-name").text(city);
        // Set today's date
        $("#date").text("(" + moment.unix(day.dt).format("MM/DD/YYYY") + ")");
        // Set today's icon
        $("#icon").attr("src", `https://openweathermap.org/img/w/${day.weather[0].icon}.png`);
        // Set today's description
        $("#description").text(day.weather[0].description);
        // Set today's temperature
        $("#temp").text("Temp: " + day.temp.day + " °F");
        // Set today's humidity
        $("#humidity").text("Humidity: " + day.humidity + " %");
        // Set today's wind speed
        $("#wind-speed").text("Wind: " + day.wind_speed + " mph");
        // Set today's UV index
        // $("#uv-index").text("UV: " + day.uvi + " %");

        // Iterate through the list of forecast days
        // Get daily forecast from day 1 to day 5

        var daily = jsonObject.daily.slice(1, 6);

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
                wind: day.wind_speed + " mph",
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
);

// Transpose Array of Objects
// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    })
};