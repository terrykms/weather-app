const CURRENT_WEATHER_DATA_API = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODING_API = "http://api.openweathermap.org/geo/1.0/direct";
const API_KEY = "1501a965f1790381be648537630b699a";

$(document).ready(function() {
    /* ------- clear suggestions to update with every keydown------ */
    $("#city").keydown(function() {
        $(".suggestion").remove(); 
    })

    /* -------- update suggestions ------- */
    $("#city").keyup(function() {
        var keyword = $(this).val(); // current value in input

        if (keyword != "") {
            $.ajax({
                url: GEOCODING_API + "?q=" + keyword + "&limit=5" + "&appid=" + API_KEY,
                dataType: "json",

                success: function(data) {
                    // for each data, append them to the "suggestions list". 
                    data.forEach(item => {
                        $("<div />", {
                            text: item.name + "," + (item.state ? (item.state + ",") : "") + item.country, // {city name},{state code},{country code}
                            "data-value": item.name + "," + (item.state ? (item.state + ",") : "") + item.country, // {city name},{state code},{country code}
                            class: "suggestion"
                        }).appendTo("#searchResults");
                    })

                    // onclick event: fill in the input box with the selected city. 
                    $(".suggestion").on("click", function() {
                        var key = $(this).data("value");
                        $("#city").val(key);
                    })
                },
                error: function(xhr, status, error) {
                    // define later
                    console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
                }          
            })
        }
    })


    /* ------------------------ 
    send cityKey to API and get the relevant information 
        - function getCityCoordinates
    ------------------------------ */

    $("#submitBtn").on("click", function(evt) {
        evt.preventDefault();
        var key = $("#city").val()
        getCityCoordinates(key);
        $(".suggestion").remove(); 
    })

    $("#city").keydown(function(evt) {
        // enter key
        if (evt.keyCode === 13) {
            evt.preventDefault();
            var key = $("#city").val()
            getCityCoordinates(key);
            // $(".suggestion").remove(); 
        }
    })

    function getCityCoordinates(cityKey) {
        $.ajax({
            url: GEOCODING_API + "?q=" + cityKey + "&limit=5" + "&appid=" + API_KEY,
            dataType: "json",

            success: function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                getWeatherData(lat, lon)
            },
            error: function(xhr, status, error) {
                //define later
                console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }          
        })
    }

    function getWeatherData(lat, lon) {
        $.ajax({
            url: CURRENT_WEATHER_DATA_API + "?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric",
            dataType: "json",

            success: function(data) {
                console.log(data)

                /* ------ CITY/STATE/COUNTRY ------- */
                var city = data.name;
                var country = data.sys.country;
                $("#cityName").html(city);
                $("#countryName").html(country);

                /* ------ WEATHER ------- */
                var weather = data.weather[0].main;
                var weatherDesc = data.weather[0].description;
                console.log(weatherDesc);
                // $("#weather").html(weatherDesc);
                $("#weatherIcon").attr({
                    src: "img/icons/" + data.weather[0].icon + ".png",
                    width: "64px",
                    height: "64px",
                });



                /* ------ SUNRISE/SUNSET ------ */
                const SECONDS_TO_MILLISECONDS = 1000;
                const MINUTES_TO_SECONDS = 60;

                var date = new Date(Date.now());
                var localTimezoneOffset = date.getTimezoneOffset() * MINUTES_TO_SECONDS // convert from minutes to seconds
                var timeConversionFactor = localTimezoneOffset + data.timezone;

                var sunrise = new Date((data.sys.sunrise + timeConversionFactor) * SECONDS_TO_MILLISECONDS);
                var sunset = new Date((data.sys.sunset + timeConversionFactor) * SECONDS_TO_MILLISECONDS)

                /* ------ TEMPERATURE ----- */
                var temp = data.main.temp;
                var tempFeelsLike = data.main.feels_like;
                var minTemp = data.main.temp_min;
                var maxTemp = data.main.temp_max;   
                
                $("#temp").html(temp.toFixed(1));
                $("#maxTemp").html("Highest: " + maxTemp);
                $("#minTemp").html("Lowest: " + minTemp);         
                $("#feelsLike").html("Feels Like: " + tempFeelsLike.toFixed(1))

                /* ------ HUMIDITY/WIND/PRECIPITATION ------ */
                var humidity = data.main.humidity;
                $("#humidity").html("Humidity: " + humidity + "&#x25;");
                


                // change display from none to initial. 
                $("#weatherContainer").removeAttr("style")

                //last update (local time)
                var lastUpdate = new Date(data.dt * SECONDS_TO_MILLISECONDS);
                $("#lastUpdated").html(lastUpdate)
            },
            error: function(xhr, status, error) {
                //define later
                console.log("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
            }
        })
    }
})